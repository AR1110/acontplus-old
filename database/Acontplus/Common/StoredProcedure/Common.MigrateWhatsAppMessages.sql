USE Acontplus
GO

CREATE OR ALTER PROCEDURE Common.MigrateWhatsAppMessages
    @BatchSize INT = 1000,
    @MaxRetries INT = 3
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Error handling variables
    DECLARE @ErrorMessage NVARCHAR(4000);
    DECLARE @ErrorSeverity INT;
    DECLARE @ErrorState INT;
    DECLARE @StartTime DATETIME = GETDATE();
    DECLARE @ProcessedCount INT = 0;
    DECLARE @ErrorCount INT = 0;
    DECLARE @ContinueProcess BIT = 1;
    
    -- Reusable variables
    DECLARE @RowCount INT;
    DECLARE @notificationTypeId INT;
    DECLARE @whatsAppSenderConfigId INT;
    DECLARE @priorityId INT;
    DECLARE @statusId INT;

    -- Create a temp table to store batch data
    CREATE TABLE #BatchToProcess (
        RowNum INT IDENTITY(1,1),
        idMessage INT,
        idUsuarioRol INT,
        browser VARCHAR(300),
        os VARCHAR(300),
        receptor VARCHAR(50),
        mensaje VARCHAR(MAX),
        params VARCHAR(MAX),
        fechaRegistro DATETIME
    );

    -- Set values for reusable constants
    SELECT @notificationTypeId = Id 
    FROM Common.NotificationType WITH (NOLOCK)
    WHERE Code = 'WA';

    SELECT @priorityId = Id 
    FROM Common.[Priority] WITH (NOLOCK)
    WHERE Code = 'H';

    SELECT @statusId = Id 
    FROM Common.[Status] WITH (NOLOCK)
    WHERE Code = 'S';

    -- Validate required configuration
    IF @notificationTypeId IS NULL OR @priorityId IS NULL OR @statusId IS NULL
        RAISERROR('Required configuration is missing in the system.', 16, 1);

    WHILE (@ContinueProcess = 1)
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION;

            -- Clear temp table
            TRUNCATE TABLE #BatchToProcess;

            -- Get batch of records to process
            INSERT INTO #BatchToProcess (
                idMessage, idUsuarioRol, browser, os, 
                receptor, mensaje, params, fechaRegistro
            )
            SELECT TOP (@BatchSize)
                idMessage, idUsuarioRol, browser, os,
                receptor, mensaje, params, fechaRegistro
            FROM Config.WhatsappMessage WITH (UPDLOCK, READPAST)
            ORDER BY idMessage;

            IF @@ROWCOUNT = 0 
            BEGIN
                SET @ContinueProcess = 0;
                IF @@TRANCOUNT > 0
                    COMMIT TRANSACTION;
                BREAK;
            END

            -- Process each record in the batch
            DECLARE @currentRow INT = 1;
            
            WHILE EXISTS (SELECT 1 FROM #BatchToProcess WHERE RowNum = @currentRow)
            BEGIN
                DECLARE @notificationId INT, @userId INT, @companyId INT;
                DECLARE @userRoleId INT, @browser VARCHAR(300), @os VARCHAR(300),
                        @receptor VARCHAR(50), @mensaje VARCHAR(MAX),
                        @params VARCHAR(MAX), @fechaRegistro DATETIME,
                        @idMessage INT;

                -- Get current row data
                SELECT 
                    @idMessage = idMessage,
                    @userRoleId = idUsuarioRol,
                    @browser = browser,
                    @os = os,
                    @receptor = receptor,
                    @mensaje = mensaje,
                    @params = params,
                    @fechaRegistro = fechaRegistro
                FROM #BatchToProcess
                WHERE RowNum = @currentRow;

                -- Get user and company details
                SELECT @companyId = idEntidad, @userId = idUsuario
                FROM v_usuario WITH (NOLOCK)
                WHERE idUsuarioRol = @userRoleId;

                -- Determine WhatsApp sender configuration with better caching
                SELECT TOP 1 @whatsAppSenderConfigId = Id
                FROM Config.WhatsAppSenderConfig WITH (NOLOCK)
                WHERE (CompanyId = @companyId OR (IsGlobal = 1 AND Enabled = 1))
                ORDER BY CASE WHEN CompanyId = @companyId THEN 0 ELSE 1 END;

                -- Insert notification with error handling
                INSERT INTO Common.Notification (
                    [NotificationTypeId], [CompressedParameters], [Title],
                    [UserId], IsRead, CreatedAt, [FromMobile]
                )
                VALUES (
                    @notificationTypeId,
                    COMPRESS(ISNULL(@params, '{}')),
                    'Mensaje de WhatsApp',
                    @userId,
                    CAST(1 AS BIT),
                    @fechaRegistro,
                    0
                );

                SET @notificationId = SCOPE_IDENTITY();

                -- Insert WhatsApp message
                INSERT INTO Common.WhatsAppMessage (
                    [NotificationId], [WhatsAppSenderConfigId], [CompressedMessage],
                    [Os], [Browser], [RecipientPhoneNumber], [PriorityId],
                    [StatusId], [SentAt], [UserId], [FromMobile]
                )
                VALUES (
                    @notificationId,
                    @whatsAppSenderConfigId,
                    COMPRESS(@mensaje),
                    @os,
                    @browser,
                    @receptor,
                    @priorityId,
                    @statusId,
                    @fechaRegistro,
                    @userId,
                    0
                );

                SET @currentRow = @currentRow + 1;
                SET @ProcessedCount = @ProcessedCount + 1;
            END;

            -- Delete processed records
            DELETE FROM Config.WhatsappMessage
            WHERE idMessage IN (
                SELECT idMessage FROM #BatchToProcess
            );

            COMMIT TRANSACTION;

            -- Log progress
            RAISERROR('Processed %d messages. Total processed: %d', 10, 1, 
                     @@ROWCOUNT, @ProcessedCount) WITH NOWAIT;

        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0
                ROLLBACK TRANSACTION;

            SELECT 
                @ErrorMessage = ERROR_MESSAGE(),
                @ErrorSeverity = ERROR_SEVERITY(),
                @ErrorState = ERROR_STATE();

            -- Log error details
            INSERT INTO ErroresSistema(
                ErrorMessage,
                ErrorNumber,
                ErrorSeverity,
                ErrorState,
                ErrorLine,
                ErrorProcedure,
                ErrorDate
            )
            VALUES (
                @ErrorMessage,
                ERROR_NUMBER(),
                @ErrorSeverity,
                @ErrorState,
                ERROR_LINE(),
                ERROR_PROCEDURE(),
                GETDATE()
            );

            SET @ErrorCount = @ErrorCount + 1;
            
            -- Retry logic
            IF @ErrorCount > @MaxRetries
            BEGIN
                SET @ContinueProcess = 0;
                RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
            END
            ELSE
            BEGIN
                WAITFOR DELAY '00:00:05';  -- 5 second delay before retry
            END
        END CATCH;
    END;

    -- Clean up
    DROP TABLE #BatchToProcess;

    -- Log completion
    DECLARE @EndTime DATETIME = GETDATE();
    DECLARE @Duration INT = DATEDIFF(SECOND, @StartTime, @EndTime);
    
    RAISERROR('Migration completed. Processed %d messages in %d seconds with %d errors.', 
              10, 1, @ProcessedCount, @Duration, @ErrorCount) WITH NOWAIT;
END;
GO