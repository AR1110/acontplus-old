USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-08
-- Description: sp for insert notification
-- =============================================
CREATE OR ALTER PROCEDURE Seguridad.AccessAuthorization_Insert @uuid UNIQUEIDENTIFIER
	,@userRoleId INT
    ,@fromMobile BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON; 

	DECLARE @userId INT,
        @idEntidad INT;

	DECLARE @params VARCHAR(MAX)
    
    DECLARE @notificationId INT;
    DECLARE @notificationTypeId INT;
    DECLARE @emailSenderConfigId INT;
    DECLARE @priorityId INT;
    DECLARE @statusId INT;


	DECLARE @receptor VARCHAR(200)
	DECLARE @codigo VARCHAR(5)
	DECLARE @jsonConfig AS VARCHAR(MAX)
	DECLARE @id INT 

	--Email 
	DECLARE @body VARCHAR(MAX);
	DECLARE @cliente VARCHAR(100)
	DECLARE @documento VARCHAR(30)
	DECLARE @template VARCHAR(50)
	DECLARE @subject VARCHAR(100);

    print 'inside auth'
    --BEGIN TRY

            -- Set values for reusable constants
        SET @notificationTypeId = (SELECT TOP 1 Id FROM Common.NotificationType WHERE Code = 'E');
        SET @priorityId = (SELECT Id FROM Common.[Priority] WHERE Code = 'H');
        SET @statusId = (SELECT Id FROM Common.[Status] WHERE Code = 'Q');

        IF (@notificationTypeId IS NULL OR @notificationTypeId = 0)
            BEGIN
                PRINT 'No Notification Type'
                RETURN
            END

        IF (@priorityId IS NULL OR @priorityId = 0)
            BEGIN
                PRINT 'Not Priority'
                RETURN
            END

            IF (@statusId IS NULL OR @statusId = 0)
            BEGIN
                PRINT 'No Status'
                RETURN
            END

	    SELECT @template = 'Email_Auth.html'
        SET @subject = 'Solicitud de Autorizaci�n de Ingreso'

        DECLARE @userToSendEmail AS TABLE (
            body VARCHAR(MAX) NOT NULL,
            params VARCHAR(MAX) NOT NULL,
            receptor VARCHAR(100) NOT NULL
        );

        DECLARE @requesting_user VARCHAR(300)
              ,@username VARCHAR(100)
              ,@company VARCHAR(300)
              ,@role VARCHAR(25)
              ,@auth_code INT = (SELECT 100000 + ABS(CHECKSUM(NEWID()) % 900000))


       SELECT @company = IIF(e.nombreComercial IS NULL, e.razonSocial, e.nombreComercial)
        ,@role = r.[Name]
        ,@username = u.nombreUsuario
        ,@requesting_user = UPPER(c.BusinessName)
        ,@userId = ur.idUsuario
        FROM Acontplus.App.UsuarioRol ur 
        INNER JOIN Acontplus.dbo.Entidad e ON ur.idEntidad = e.idEntidad
        INNER JOIN Seguridad.[Role] r ON ur.RoleId = r.Id
        INNER JOIN Acontplus.dbo.Usuario u ON ur.idUsuario = u.idUsuario
        LEFT JOIN Acontplus.Customer.Customer c ON u.customerId = c.Id
        WHERE ur.idUsuarioRol = @userRoleId

        SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        IF NOT EXISTS (SELECT 1 FROM Config.EmailSenderConfig WHERE CompanyId = @idEntidad)
            BEGIN
                SET @emailSenderConfigId = (SELECT TOP 1 Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE IsGlobal = 1 AND IsActive = 1);
            END
            ELSE
            BEGIN
                SET @emailSenderConfigId = (SELECT Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE CompanyId = @idEntidad);
            END

        IF (@emailSenderConfigId IS NULL OR @emailSenderConfigId = 0)
            BEGIN
                PRINT 'No Config'
                RETURN
            END

            INSERT INTO @userToSendEmail(body, params, receptor)
			SELECT (SELECT @requesting_user requesting_user
                                                    ,@auth_code auth_code
                                                    ,approving_user = cc.businessName
                                                    ,@username username
                                                    ,@company company
                                                    ,@role AS 'role'
                                                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
					),
             (SELECT hasFile = CAST(0 AS BIT) FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
                                       u.correo
								       FROM Acontplus.dbo.Usuario u 
                                       INNER JOIN Acontplus.App.UsuarioRol ur ON u.idUsuario = ur.idUsuario
                                       INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                                       INNER JOIN Config.Company c WITH (NOLOCK) ON e.Uuid = c.Uuid 
                                       INNER JOIN Seguridad.[Role] r ON ur.RoleId = r.Id
                                       LEFT JOIN Acontplus.Customer.Customer cc On u.customerId = c.Id
               WHERE r.Code = 'ADM'
                   AND c.Id IN (SELECT cc.Id FROM Acontplus.App.UsuarioRol urr WITH (NOLOCK) 
                                             INNER JOIN Acontplus.dbo.Entidad ee WITH (NOLOCK) ON urr.idEntidad = ee.idEntidad
                                             INNER JOIN Config.Company cc WITH (NOLOCK) ON ee.Uuid = cc.Uuid 
                                             WHERE urr.idUsuarioRol = @userRoleId
                                             AND urr.estado = 1)
                   AND u.correo IS NOT NULL
                   AND u.estado = 1
                
	            --BEGIN TRAN;

                    INSERT INTO Seguridad.AccessAuthorization(SenderId, ReceiverId, Code, Uuid)
                    SELECT @userId, u.idUsuario, @auth_code, @Uuid FROM Acontplus.dbo.Usuario u 
                    INNER JOIN Acontplus.App.UsuarioRol ur ON u.idUsuario = ur.idUsuario
                    INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                    INNER JOIN Config.Company c WITH (NOLOCK) ON e.Uuid = c.Uuid 
                    INNER JOIN Seguridad.[Role] r ON ur.RoleId = r.Id
                    WHERE  r.Code = 'ADM'
                    AND c.Id IN (SELECT cc.Id FROM Acontplus.App.UsuarioRol urr WITH (NOLOCK) 
                                                                                INNER JOIN Acontplus.dbo.Entidad ee WITH (NOLOCK) ON urr.idEntidad = ee.idEntidad
                                                                                INNER JOIN Config.Company cc WITH (NOLOCK) ON ee.Uuid = cc.Uuid 
                                                                                WHERE urr.idUsuarioRol = @userRoleId
                                                                                AND urr.estado = 1
                                                                    )
                    AND u.correo IS NOT NULL
                    AND u.estado = 1
           
                    DECLARE cursorUser CURSOR LOCAL FOR
                    SELECT body, params, receptor
                    FROM @userToSendEmail;

                    OPEN cursorUser;

                    FETCH NEXT FROM cursorUser INTO @body, @params, @receptor;

                    WHILE @@FETCH_STATUS = 0
                    BEGIN
                        -- Insert into Notification table
                        INSERT INTO Common.Notification ([NotificationTypeId], [CompressedParameters], [Title], [Subject], [CreatedByUserId], [FromMobile])
                        VALUES (@notificationTypeId, COMPRESS(ISNULL(@params, '{}')), 'Envio por correo', @subject, @userId, @fromMobile);

                        SET @notificationId = SCOPE_IDENTITY();

                        -- Insert into EmailQueue table
                        INSERT INTO Common.EmailQueue ([NotificationId], [EmailSenderConfigId], [RecipientEmail], [Subject], [IsHtml],
                        [CompressedBody], [PriorityId], [StatusId], [Template], [CreatedByUserId], [FromMobile])
                        VALUES (@notificationId, @emailSenderConfigId, @receptor, @subject, CAST(0 AS BIT),
                        COMPRESS(@body), @priorityId, @statusId, @template, @userId, @fromMobile);

                        FETCH NEXT FROM cursorUser INTO @body, @params, @receptor;
                    END;

                    CLOSE cursorUser;
                    DEALLOCATE cursorUser;

        -- Commit transaction if all goes well
  --      COMMIT TRAN
  --  END TRY
  --  BEGIN CATCH
  --       IF @@TRANCOUNT > 0
  --          ROLLBACK TRANSACTION;
  --      INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		--VALUES (NEWID(), 'AccessAuthorization/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
  --  END CATCH
END
GO
