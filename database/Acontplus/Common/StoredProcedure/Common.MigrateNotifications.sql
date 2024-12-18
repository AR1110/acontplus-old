USE Acontplus
GO

CREATE OR ALTER PROCEDURE Common.MigrateNotifications
AS
BEGIN
    DECLARE @BatchSize INT = 1000;
    DECLARE @RowCount INT;
    DECLARE @notificationTypeId INT;
    DECLARE @emailSenderConfigId INT;
    DECLARE @priorityId INT;
    DECLARE @statusId INT;

    -- Set values for reusable constants
    SET @notificationTypeId = (SELECT TOP 1 Id FROM Common.NotificationType WHERE Code = 'E');
    SET @priorityId = (SELECT Id FROM Common.[Priority] WHERE Code = 'M');
    --SET @statusId = (SELECT Id FROM Common.[Status] WHERE Code = 'S');

    WHILE (1 = 1)
    BEGIN
        -- Get the next batch of rows to process
        DECLARE @notificationId INT, @companyId INT;
        DECLARE @params VARCHAR(1000),@emailData VARCHAR(MAX), @receptor VARCHAR(150),
        @fechaRegistro DATETIME, @estado VARCHAR(5), @fechaEnvio DATETIME, @idUsuario INT;

        -- Check if there are rows to process
        IF NOT EXISTS (SELECT 1 FROM App.Notificacion)
            BREAK;

        -- Cursor for batch processing
        DECLARE SourceCursor CURSOR FOR
        SELECT TOP (@BatchSize) [params], [emailData], [receptor], [fechaRegistro], [estado], [fechaEnvio], [idUsuario]
        FROM App.Notificacion
        ORDER BY idNotificacion;

        OPEN SourceCursor;

        FETCH NEXT FROM SourceCursor INTO @params, @emailData, @receptor, @fechaRegistro, @estado, @fechaEnvio, @idUsuario;

        SET @RowCount = @@FETCH_STATUS;

        WHILE @RowCount = 0
        BEGIN
            -- Get user and company details
            SELECT TOP 1 @companyId = idEntidad
            FROM v_usuario
            WHERE idUsuarioRol = @idUsuario
            ORDER BY idUsuarioRol DESC;

            -- Determine WhatsApp sender configuration
            IF NOT EXISTS (SELECT 1 FROM Config.EmailSenderConfig WHERE CompanyId = @companyId)
            BEGIN
                SET @emailSenderConfigId = (SELECT TOP 1 Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE IsGlobal = 1 AND Enabled = 1);
            END
            ELSE
            BEGIN
                SET @emailSenderConfigId = (SELECT Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE CompanyId = @companyId);
            END

            DECLARE @subject VARCHAR(300), @body VARCHAR(MAX), @template VARCHAR(150), @cc VARCHAR(1000);

            SELECT @subject = JSON_VALUE(@emailData, '$.subject'),
                @body = JSON_VALUE(@emailData, '$.body'),
                @template = JSON_VALUE(@emailData, '$.template'),
                @cc = JSON_VALUE(@emailData, '$.cc');

            -- Insert into Notification table
            INSERT INTO Common.Notification ([NotificationTypeId], [CompressedParameters], [Title], [Subject], [UserId], IsRead, CreatedAt, [FromMobile])
            VALUES (@notificationTypeId, COMPRESS(ISNULL(@params, '{}')), 'Envio por correo', @subject, @idUsuario, IIF(@estado = 'E', CAST(1 AS BIT), CAST(0 AS BIT)), @fechaRegistro, 0);

            SET @notificationId = SCOPE_IDENTITY();

            -- Insert into WhatsAppMessage table
            INSERT INTO Common.EmailQueue ([NotificationId], [EmailSenderConfigId], [RecipientEmail], Cc, [Subject], [IsHtml],
            [CompressedBody], [PriorityId], [StatusId], [SentAt], [Template], [CreatedAt], [UserId], [FromMobile])
            
            VALUES (@notificationId, @emailSenderConfigId, @receptor, @cc, @subject, CAST(0 AS BIT),
            COMPRESS(@body), @priorityId, 
            CASE 
                WHEN @estado = 'E' THEN (SELECT Id FROM Common.[status] WHERE Code = 'S')
                WHEN @estado = 'NE' THEN (SELECT Id FROM Common.[status] WHERE Code = 'Q')
                WHEN @estado = 'ERROR' THEN (SELECT Id FROM Common.[status] WHERE Code = 'F')
            END, @fechaEnvio, @template, @fechaRegistro, @idUsuario, 0
            )

            FETCH NEXT FROM SourceCursor INTO @params, @emailData, @receptor, @fechaRegistro, @estado, @fechaEnvio, @idUsuario;

            SET @RowCount = @@FETCH_STATUS;
        END;

        CLOSE SourceCursor;
        DEALLOCATE SourceCursor;

        -- Remove processed rows from the source table
        DELETE FROM App.Notificacion
        WHERE idNotificacion IN (
            SELECT TOP (@BatchSize) idNotificacion
            FROM App.Notificacion
            ORDER BY idNotificacion
        );
        -- Debugging
        PRINT 'Rows deleted: ' + CAST(@@ROWCOUNT AS VARCHAR);

        -- Check if there are more rows to process
        IF NOT EXISTS (SELECT 1 FROM App.Notificacion)
            BREAK;
    END;
END;
GO
