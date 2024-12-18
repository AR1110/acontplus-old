USE Acontplus
GO

CREATE OR ALTER PROCEDURE Common.MigrateWhatsAppMessages
AS
BEGIN
    DECLARE @BatchSize INT = 1000;
    DECLARE @RowCount INT;
    DECLARE @notificationTypeId INT;
    DECLARE @whatsAppSenderConfigId INT;
    DECLARE @priorityId INT;
    DECLARE @statusId INT;

    -- Set values for reusable constants
    SET @notificationTypeId = (SELECT TOP 1 Id FROM Common.NotificationType WHERE Code = 'WA');
    SET @priorityId = (SELECT Id FROM Common.[Priority] WHERE Code = 'H');
    SET @statusId = (SELECT Id FROM Common.[Status] WHERE Code = 'S');

    WHILE (1 = 1)
    BEGIN
        -- Get the next batch of rows to process
        DECLARE @notificationId INT, @userId INT, @companyId INT;
        DECLARE @userRoleId INT, @browser VARCHAR(300), @os VARCHAR(300),
                @receptor VARCHAR(50), @mensaje VARCHAR(2000), 
                @params VARCHAR(2000), @fechaRegistro DATETIME;

        -- Check if there are rows to process
        IF NOT EXISTS (SELECT 1 FROM Config.WhatsappMessage)
            BREAK;

        -- Cursor for batch processing
        DECLARE SourceCursor CURSOR FOR
        SELECT TOP (@BatchSize) idUsuarioRol, browser, os,
               receptor, mensaje, params, fechaRegistro
        FROM Config.WhatsappMessage
        ORDER BY idMessage;

        OPEN SourceCursor;

        FETCH NEXT FROM SourceCursor INTO @userRoleId, @browser, @os, @receptor, @mensaje, @params, @fechaRegistro;

        SET @RowCount = @@FETCH_STATUS;

        WHILE @RowCount = 0
        BEGIN
            -- Get user and company details
            SELECT @companyId = idEntidad, @userId = idUsuario
            FROM v_usuario
            WHERE idUsuarioRol = @userRoleId;

            -- Determine WhatsApp sender configuration
            IF NOT EXISTS (SELECT 1 FROM Config.WhatsAppSenderConfig WHERE CompanyId = @companyId)
            BEGIN
                SET @whatsAppSenderConfigId = (SELECT TOP 1 Id 
                                               FROM Config.WhatsAppSenderConfig 
                                               WHERE IsGlobal = 1 AND Enabled = 1);
            END
            ELSE
            BEGIN
                SET @whatsAppSenderConfigId = (SELECT Id 
                                               FROM Config.WhatsAppSenderConfig 
                                               WHERE CompanyId = @companyId);
            END

            -- Insert into Notification table
            INSERT INTO Common.Notification ([NotificationTypeId], [CompressedParameters], [Title], [UserId], IsRead, CreatedAt, [FromMobile])
            VALUES (@notificationTypeId, COMPRESS(ISNULL(@params, '{}')), 'Mensaje de WhatsApp', @userId, CAST(1 AS BIT), @fechaRegistro, 0);

            SET @notificationId = SCOPE_IDENTITY();

            -- Insert into WhatsAppMessage table
            INSERT INTO Common.WhatsAppMessage ([NotificationId], [WhatsAppSenderConfigId], [CompressedMessage], [Os], [Browser],
                                                [RecipientPhoneNumber], [PriorityId], [StatusId], [SentAt], [UserId], [FromMobile])
            VALUES (@notificationId, @whatsAppSenderConfigId, COMPRESS(@mensaje), @os, @browser, 
                    @receptor, @priorityId, @statusId, @fechaRegistro, @userId, 0);

            FETCH NEXT FROM SourceCursor INTO @userRoleId, @browser, @os, @receptor, @mensaje, @params, @fechaRegistro;

            SET @RowCount = @@FETCH_STATUS;
        END;

        CLOSE SourceCursor;
        DEALLOCATE SourceCursor;

        -- Remove processed rows from the source table
        DELETE FROM Config.WhatsappMessage
        WHERE idMessage IN (
            SELECT TOP (@BatchSize) idMessage
            FROM Config.WhatsappMessage
            ORDER BY idMessage
        );
        -- Debugging
        PRINT 'Rows deleted: ' + CAST(@@ROWCOUNT AS VARCHAR);

        -- Check if there are more rows to process
        IF NOT EXISTS (SELECT 1 FROM Config.WhatsappMessage)
            BREAK;
    END;
END;
GO
