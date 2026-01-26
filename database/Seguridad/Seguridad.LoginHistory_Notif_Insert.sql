USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date:  2024-04-03
-- Description: sp for insert send email of logins
-- =============================================
CREATE OR ALTER PROCEDURE Seguridad.LoginHistory_Notif_Insert @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @userId INT
		,@userRoleId INT
        ,@idEntidad INT
		,@userAgentMain VARCHAR(MAX)
		,@loginDate DATETIME2
        ,@fromMobile BIT;

    DECLARE @userAgent VARCHAR(MAX)
		,@ipAddress VARCHAR(100)

    DECLARE @browser VARCHAR(MAX)
        ,@os VARCHAR(MAX)


    DECLARE @params VARCHAR(MAX)

    DECLARE @notificationId INT;
    DECLARE @notificationTypeId INT;
    DECLARE @emailSenderConfigId INT;
    DECLARE @priorityId INT;
    DECLARE @statusId INT;

	DECLARE @receptor VARCHAR(200);
    DECLARE @userEmail VARCHAR(100);
	DECLARE @codigo VARCHAR(5);
	DECLARE @jsonConfig AS VARCHAR(MAX);
	DECLARE @id INT;

	--Email 
	DECLARE @body VARCHAR(MAX);
	DECLARE @cliente VARCHAR(100);
	DECLARE @template VARCHAR(50);
	DECLARE @subject VARCHAR(100);

    DECLARE @userToSendEmail AS TABLE (
        body VARCHAR(MAX) NOT NULL,
        params VARCHAR(MAX) NOT NULL,
        receptor VARCHAR(100) NOT NULL
    );

    DECLARE @requesting_user VARCHAR(300)
        ,@username VARCHAR(100)
        ,@company VARCHAR(300)
        ,@userCodeRole VARCHAR(10)
        ,@role VARCHAR(25);

    BEGIN TRY
                      
            -- Set values for reusable constants
        SET @notificationTypeId = (SELECT TOP 1 Id FROM Common.NotificationType WHERE Code = 'E');
        SET @priorityId = (SELECT Id FROM Common.[Priority] WHERE Code = 'M');
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

        SELECT @userAgentMain = userAgent
            ,@loginDate = [Utils].[ConvertToEcuadorTimeZone](createdAt)
            ,@userRoleId = userRoleId
            ,@userId = userId
            ,@fromMobile = fromMobile
        FROM OPENJSON (@json) WITH (
                userAgent VARCHAR(MAX),
                createdAt DATETIME2,
                userRoleId INT, 
                userId INT,
                fromMobile BIT);

        SELECT @userAgent = userAgent
            ,@ipAddress = ipAddress
        FROM OPENJSON (@userAgentMain) WITH (userAgent VARCHAR(MAX), ipAddress VARCHAR(100))

        SET @browser = (SELECT JSON_VALUE(@userAgent, '$.browser.name') + ' - version: ' + JSON_VALUE(@userAgent, '$.browser.version'))
        SET @os = (JSON_VALUE(@userAgent, '$.os.name') + ' - version: ' + JSON_VALUE(@userAgent, '$.os.version'))
    
        SELECT @template = 'Login_History.html';
        SET @subject = 'ACCESO CON EXITO';

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

        SELECT @company = IIF(en.nombreComercial IS NULL, en.razonSocial, en.nombreComercial)
                                        ,@userCodeRole = ro.Code
                                        ,@role = ro.[Name]
                                        ,@username = us.nombreUsuario
                                        ,@requesting_user = UPPER(cu.BusinessName)
                                        ,@userEmail = us.correo
        FROM Acontplus.App.UsuarioRol              ur WITH (NOLOCK) 
        INNER JOIN Acontplus.dbo.Entidad           en WITH (NOLOCK) ON en.idEntidad = ur.idEntidad
        INNER JOIN Seguridad.[Role] ro WITH (NOLOCK) ON ro.Id        = ur.RoleId
        INNER JOIN Acontplus.dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = ur.idUsuario
        LEFT JOIN Customer.Customer               cu WITH (NOLOCK) ON cu.Id        = us.CustomerId
        WHERE ur.idUsuarioRol = @userRoleId

        INSERT INTO @userToSendEmail(body, params, receptor)
		SELECT  (SELECT @requesting_user requesting_user
                                                ,IIF(@fromMobile = CAST(1 AS BIT), 'no aplica', @browser) browser
                                                ,IIF(@fromMobile = CAST(1 AS BIT), 'app m�vil', @os) os
                                                ,CONVERT(VARCHAR, FORMAT(@loginDate, 'dd/MM/yyyy HH:mm:ss'), 13) loginDate
                                                ,ISNULL(@ipAddress, '') ipAddress
                                                ,@username username
                                                ,@company company
                                                ,@role AS 'role'  FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							   ),
                               (SELECT hasFile = CAST(0 AS BIT) FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
                               @userEmail

        
        IF (@userCodeRole <> 'ADM')
            BEGIN
                INSERT INTO @userToSendEmail(body, params, receptor)
                		SELECT  (SELECT @requesting_user requesting_user
                                                ,approving_user = UPPER(ISNULL(cu.BusinessName, us.nombreUsuario))
                                                ,IIF(@fromMobile = CAST(1 AS BIT), 'no aplica', @browser) browser
                                                ,IIF(@fromMobile = CAST(1 AS BIT), 'app m�vil', @os) os
                                                ,CONVERT(VARCHAR, FORMAT(@loginDate, 'dd/MM/yyyy HH:mm:ss'), 13) loginDate
                                                ,ISNULL(@ipAddress, '') ipAddress
                                                ,@username username
                                                ,@company company
                                                ,@role AS 'role'  FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							   ),
                               (SELECT hasFile = CAST(0 AS BIT) FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
                                       us.correo
						        FROM Acontplus.App.UsuarioRol              ur WITH (NOLOCK)
                                INNER JOIN Seguridad.[Role] ro WITH (NOLOCK) ON ro.Id        = ur.RoleId
                                INNER JOIN Acontplus.dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = ur.idUsuario
                                LEFT JOIN Customer.Customer               cu WITH (NOLOCK) ON cu.Id        = us.CustomerId
                                WHERE ur.idEntidad = @idEntidad 
                                    AND ro.Code = 'ADM'
                                    AND ur.estado = 1
            END
        
        BEGIN TRAN;
           
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
        COMMIT TRAN
    END TRY
    BEGIN CATCH
         IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        INSERT INTO ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
		VALUES ('LoginHistory/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
    END CATCH
END
GO
