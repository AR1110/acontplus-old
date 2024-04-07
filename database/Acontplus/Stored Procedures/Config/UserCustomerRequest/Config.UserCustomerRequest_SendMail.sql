USE [Acontplus]
GO
/****** Object:  StoredProcedure [Config].[Solicitud_Insert]    Script Date: 3/4/2024 14:19:02 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Emilio Senguana.
-- Create date: 11/04/2023
-- Description:	
-- =============================================
CREATE OR ALTER  PROCEDURE Config.UserCustomerRequest_SendMail @userRoleId INT, @userCustomerRequestId INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
 	DECLARE @idEntidad INT 
    DECLARE @userId INT  
	
	DECLARE @isCompleted BIT 
    DECLARE @isApproved BIT 

	DECLARE @tbUserRole as Table (
		userRoleId INT NOT NULL UNIQUE
	)

    ---START EMAL 
    DECLARE  @enableSsl INT 
    DECLARE @from  VARCHAR(100)
    DECLARE @host  VARCHAR(100) 
    DECLARE @passwordEmail VARCHAR(50)
    DECLARE @port INT 
    DECLARE @cc VARCHAR(100)

    SELECT TOP 1
           @enableSsl = [enableSsl]
          ,@from      = [from]
          ,@host      = [host]
          ,@passwordEmail  = [password]
          ,@port      = [port]
    FROM [Config].[Email_Config] WITH (NOLOCK)

    DECLARE @template VARCHAR(50)= 'RequestPermission.html'
    DECLARE @subject VARCHAR(150)
    DECLARE @custom_content VARCHAR(MAX) 

	-------------EMAIL BODY ----------------------- 

    DECLARE @userToSendEmail AS TABLE (
        emailData VARCHAR(MAX) NOT NULL,
        params VARCHAR(500) NOT NULL,
        receptor VARCHAR(100) NOT NULL
    )
		 
	

	---------------Body -------------
	DECLARE @accionDescripcion VARCHAR(50) 
	SELECT top 1 @accionDescripcion = accionDescripcion , 
                       @isCompleted = IIF(codEstado='F', 1, 0), 
                       @isApproved  = IIF(codEstado='A', 1, 0)  
    FROM Config.v_User_Request 
    WHERE idSolicitud = @userCustomerRequestId

    
    IF @isApproved = 1
        BEGIN 
            SELECT top 1 @custom_content = 'El administrador <b>' + v_ur.usuarioAprobante + '</b> ' + ' ha aprobado tu solicitud para ' + v_ur.accionDescripcion + ' el documento ' + v_ur.tipoDoc + ' Nro.: <strong>' + v_ur.serieComprobante + '</strong>.<br />'
            FROM Config.v_User_Request v_ur
            WHERE v_ur.idSolicitud = @userCustomerRequestId

            INSERT INTO @tbUserRole (userRoleId)
            SELECT @userRoleId
                 

        END 
    ELSE 
        BEGIN 
             SELECT top 1 @custom_content = 'El usuario <b>' + v_ur.usuarioSolicitante + '</b> ' +
                        CASE 
                            WHEN @isCompleted = 1 THEN 
                                CASE 
                                    WHEN v_ur.codigoAccion = 'E' THEN 'ya ha <strong>Actualizado</strong>'
                                    WHEN v_ur.codigoAccion = 'A' THEN 'ya ha <strong>Anulado</strong>' 
                                END
                            ELSE 'solicita <strong>' + v_ur.accionDescripcion + '</strong>'
                        END +
                        ' el documento ' + v_ur.tipoDoc + ' Nro.: <strong>' + v_ur.serieComprobante + '</strong>.<br />'
            FROM Config.v_User_Request v_ur
            WHERE v_ur.idSolicitud = @userCustomerRequestId


            INSERT INTO @tbUserRole (userRoleId)
            SELECT 
                CONVERT(INT, value) AS userRoleIdApprover
            FROM  Config.v_User_Permission_Sale ups WITH(NOLOCK)
            CROSS APPLY OPENJSON(ups.usersAdmin)
            WHERE ups.idUsuarioRol = @userRoleId 

        END 

         
    --Enviar por correo la notificacion 
    INSERT INTO @userToSendEmail(emailData, params, receptor)
		SELECT  
            (SELECT body = (SELECT 
                                    approverUser = v_ur.usuarioAprobante
                                    ,requestDate   = CONVERT(NVARCHAR,FORMAT(dbo.ufnGetDateEcuador() , 'dd/MM/yyyy HH:mm')) 
                                    ,v_ur.razonSocial
                                    ,v_ur.establecimiento  
                                    ,custom_content= @custom_content
							FROM Config.v_User_Request  v_ur
							WHERE v_ur.idSolicitud = @userCustomerRequestId 
                            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                            )
			        ,ISNULL(@cc,'') as 'cc' 						  
					,EnableSsl =@enableSsl
					,'from' = @from
                    ,'username' = @from
					,'host'= @host
					,'logo'= 'logoAcontPlus.jpg'
					,'password'= @passwordEmail
					,'port'= @port
					,'subject'= 'Solicitud de Permiso para ' +  @accionDescripcion  + ' Documento'
					,'template'= @template FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
			),
            (SELECT hasFile = CAST(0 AS BIT) FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
            LTRIM(RTRIM(u.correo))
        FROM @tbUserRole ua
        INNER JOIN dbo.Usuario u 
        WITH(NOLOCK) ON u.idUsuario = (SELECT TOP 1 idUsuario FROM v_usuario v_ur WHERE v_ur.idUsuarioRol =ua.userRoleId )
        WHERE LEN(ISNULL(LTRIM(RTRIM(u.correo)), '')) > 1

        INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario)
                        SELECT params, emailData, receptor,  'NE', @userId FROM @userToSendEmail 


END 