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
--- Config.UserCustomerRequest_Insert 164, '{"idDocumento":348385,"codDoc":"01","codigoAccion":"E","jsonData":{"idDocumento":348385,"codDoc":"01","tipoDoc":"Factura Electrónica"},"motivo":"FACTURA EDITANDO"}'
CREATE OR ALTER  PROCEDURE Config.UserCustomerRequest_Insert @userRoleId INT, @json VARCHAR(999)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE  @jsonData NVARCHAR(MAX)
	DECLARE @motivo VARCHAR(50)
	DECLARE @codigoAccion VARCHAR(5)
    DECLARE @tipoDoc VARCHAR(50)
	DECLARE @serieComprobante VARCHAR(50) 
    DECLARE @tipoAccion VARCHAR(30)
    DECLARE @userRequester VARCHAR(150)  

	DECLARE @idEntidad INT 
    DECLARE @userId INT  
	DECLARE @tbUsersAdmin as Table (
		userRoleIdApprover INT NOT NULL UNIQUE
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

    DECLARE @userToSendEmail AS TABLE (
        emailData VARCHAR(MAX) NOT NULL,
        params VARCHAR(500) NOT NULL,
        receptor VARCHAR(100) NOT NULL
        )


    
  ---END MAIL
	 

	SELECT 
		@motivo = motivo
		,@codigoAccion = codigoAccion
		,@jsonData = jsonData 
		,@serieComprobante = serieComprobante 
        ,@tipoDoc = tipoDoc 
	FROM OPENJSON(@json)
	WITH(
		motivo VARCHAR(300) '$.motivo'
		,codigoAccion VARCHAR(5) '$.codigoAccion'
		,jsonData NVARCHAR(MAX) '$.jsonData'
		,serieComprobante VARCHAR(50)
        ,tipoDoc VARCHAR(50) '$.tipoDoc'
	)

    SELECT top 1 @idEntidad = idEntidad, @userId = idUsuario, @userRequester = nombreUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId
    SET @tipoAccion = IIF(@codigoAccion='E', 'Editar', 'Anular') 

	INSERT INTO @tbUsersAdmin (userRoleIdApprover)
    SELECT 
        CONVERT(INT, value) AS userRoleIdApprover
    FROM  Config.v_User_Permission_Sale ups WITH(NOLOCK)
    CROSS APPLY OPENJSON(ups.usersAdmin)
    WHERE ups.idUsuarioRol = @userRoleId 
     
 
    IF @jsonData IS NULL
        BEGIN 
            SELECT '0'code, 'Datos de comprobante no válido' as 'message'
            RETURN 
        END 

    IF (SELECT COUNT(*) FROM @tbUsersAdmin) = 0
		BEGIN
			SELECT '0'code, 'Solictud de Clave de Autorización para modificar o anular el documento no tiene asignado el Receptor de la Solicitud de Aprobación' as 'message'
			RETURN
		END 

	BEGIN TRY
		BEGIN TRAN 	 
			INSERT INTO Config.Solicitud (idUsuarioRolAprobante, idUsuarioRolSolictante, observacion, codigoAccion, codEstado, jsonData, fechaRegistro)
			SELECT  userRoleIdApprover, @userRoleId, UPPER(@motivo), @codigoAccion, 'P', @jsonData, dbo.ufnGetDateEcuador()
			FROM @tbUsersAdmin  

            --Enviar por correo la notificacion 
            INSERT INTO @userToSendEmail(emailData, params, receptor)
			    SELECT  
                    (SELECT body = (  
                                    SELECT serieComprobante = @serieComprobante
                                           ,tipoAccion = @tipoAccion
                                           ,tipoDoc    = @tipoDoc
                                           ,userRequester = @userRequester
                                           ,approverUser = u.nombreCompleto
                                           ,requestDate   = CONVERT(NVARCHAR,FORMAT(dbo.ufnGetDateEcuador() , 'dd/MM/yyyy HH:mm')) 
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
						    ,'subject'= 'Solicitud de Permiso para ' + @tipoAccion  + ' Documento'
						    ,'template'= @template FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
				    ),
                    (SELECT hasFile = CAST(0 AS BIT) FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
                    LTRIM(RTRIM(u.correo))
                FROM @tbUsersAdmin ua
                INNER JOIN dbo.Usuario u 
                WITH(NOLOCK) ON u.idUsuario = (SELECT TOP 1 idUsuario FROM v_usuario v_ur WHERE v_ur.idUsuarioRol =ua.userRoleIdApprover )
                WHERE LEN(ISNULL(LTRIM(RTRIM(u.correo)), '')) > 0

             INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario)
                                SELECT params, emailData, receptor,  'NE', @userId FROM @userToSendEmail

		COMMIT TRAN  
        SELECT '1' code,'Registrado Correctamente' as 'message'	  
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 


END 