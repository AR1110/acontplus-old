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
CREATE OR ALTER  PROCEDURE Config.UserCustomerRequest_SendMail @userRoleId INT,
    @userCustomerRequestId INT
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

        DECLARE @notificationId INT;
    DECLARE @notificationTypeId INT;
    DECLARE @emailSenderConfigId INT;
    DECLARE @priorityId INT;
    DECLARE @statusId INT; 


    --> Email 
	DECLARE @body VARCHAR(MAX) 
           ,@cc VARCHAR(100)
           ,@params NVARCHAR(MAX)
           ,@receptor VARCHAR(200);

    DECLARE @template VARCHAR(50)= 'RequestPermission.html'
    DECLARE @subject VARCHAR(150)
    DECLARE @custom_content VARCHAR(MAX) 

	-------------EMAIL BODY ----------------------- 

    DECLARE @userToSendEmail AS TABLE (
        body VARCHAR(MAX) NOT NULL,
        params VARCHAR(500) NOT NULL,
        receptor VARCHAR(100) NOT NULL
    )
		 
	     -- Set values for reusable constants
        SET @notificationTypeId = (SELECT TOP 1 Id FROM Common.NotificationType WHERE Code = 'E');
        SET @priorityId = (SELECT Id FROM Common.[Priority] WHERE Code = 'M');
        SET @statusId = (SELECT Id FROM Common.[Status] WHERE Code = 'Q');

        SELECT TOP 1 @idEntidad = idEntidad, @userId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        IF NOT EXISTS (SELECT 1 FROM Config.EmailSenderConfig WHERE CompanyId = @idEntidad)
            BEGIN
                SET @emailSenderConfigId = (SELECT TOP 1 Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE IsGlobal = 1 AND Enabled = 1);
            END
            ELSE
            BEGIN
                SET @emailSenderConfigId = (SELECT Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE CompanyId = @idEntidad);
            END

        IF (@emailSenderConfigId IS NULL OR @emailSenderConfigId = 0)
            BEGIN
                SELECT '0' code, 'No existe una configuración para el envio de correo' as 'message' 
                RETURN
            END

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
            SELECT idUsuarioRolSolicitante
            FROM Config.v_User_Request v_ur
            WHERE v_ur.idSolicitud = @userCustomerRequestId
                 

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

         
    SET @subject = 'Solicitud de Permiso para ' +  @accionDescripcion  + ' Documento'
    --Enviar por correo la notificacion 
    INSERT INTO @userToSendEmail(body, params, receptor)
		SELECT   (SELECT 
                                    approverUser = v_ur.usuarioAprobante
                                    ,requestDate   = CONVERT(NVARCHAR,FORMAT(dbo.ufnGetDateEcuador() , 'dd/MM/yyyy HH:mm')) 
                                    ,v_ur.razonSocial
                                    ,v_ur.establecimiento  
                                    ,custom_content= @custom_content
							FROM Config.v_User_Request  v_ur
							WHERE v_ur.idSolicitud = @userCustomerRequestId 
                            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                            ),
            (SELECT hasFile = CAST(0 AS BIT) FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
            LTRIM(RTRIM(u.correo))
        FROM @tbUserRole ua
        INNER JOIN dbo.Usuario u 
        WITH(NOLOCK) ON u.idUsuario = (SELECT TOP 1 idUsuario FROM v_usuario v_ur WHERE v_ur.idUsuarioRol =ua.userRoleId )
        WHERE LEN(ISNULL(LTRIM(RTRIM(u.correo)), '')) > 1

        DECLARE cursorUser CURSOR LOCAL FOR
        SELECT body, params, receptor
        FROM @userToSendEmail;

        OPEN cursorUser;

        FETCH NEXT FROM cursorUser INTO @body, @params, @receptor;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Insert into Notification table
            INSERT INTO Common.Notification ([NotificationTypeId], [CompressedParameters], [Title], [Subject], [UserId], [FromMobile])
            VALUES (@notificationTypeId, COMPRESS(ISNULL(@params, '{}')), 'Envio por correo', @subject, @userId, 0);

            SET @notificationId = SCOPE_IDENTITY();

            -- Insert into EmailQueue table
            INSERT INTO Common.EmailQueue ([NotificationId], [EmailSenderConfigId], [RecipientEmail], [Subject], [IsHtml],
            [CompressedBody], [PriorityId], [StatusId], [Template], [UserId], [FromMobile])
            VALUES (@notificationId, @emailSenderConfigId, @receptor, @subject, CAST(0 AS BIT),
            COMPRESS(@body), @priorityId, @statusId, @template, @userId, 0);

            FETCH NEXT FROM cursorUser INTO @body, @params, @receptor;
        END;

        CLOSE cursorUser;
        DEALLOCATE cursorUser;
END 