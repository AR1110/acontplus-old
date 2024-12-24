USE Acontplus
GO

CREATE OR ALTER PROCEDURE Common.MigrateNotifications
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
    DECLARE @emailSenderConfigId INT;
    DECLARE @priorityId INT;

    -- Create a temp table to store batch data
    CREATE TABLE #BatchToProcess (
        RowNum INT IDENTITY(1,1),
        idNotificacion INT,
        params VARCHAR(MAX),
        emailData VARCHAR(MAX),
        receptor VARCHAR(150),
        fechaRegistro DATETIME,
        estado VARCHAR(5),
        fechaEnvio DATETIME,
        idUsuario INT
    );

    -- Set values for reusable constants
    SELECT @notificationTypeId = Id 
    FROM Common.NotificationType WITH (NOLOCK)
    WHERE Code = 'E';

    SELECT @priorityId = Id 
    FROM Common.[Priority] WITH (NOLOCK)
    WHERE Code = 'M';

    -- Validate required configuration
    IF @notificationTypeId IS NULL OR @priorityId IS NULL
        RAISERROR('Required configuration is missing in the system.', 16, 1);

    WHILE (@ContinueProcess = 1)
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION;

            -- Clear temp table
            TRUNCATE TABLE #BatchToProcess;

            -- Get batch of records to process
            INSERT INTO #BatchToProcess (
                idNotificacion, params, emailData, receptor,
                fechaRegistro, estado, fechaEnvio, idUsuario
            )
            SELECT TOP (@BatchSize)
                idNotificacion, params, emailData, receptor,
                fechaRegistro, estado, fechaEnvio, idUsuario
            FROM App.Notificacion WITH (UPDLOCK, READPAST)
            ORDER BY idNotificacion;

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
                DECLARE @notificationId INT, @companyId INT;
                DECLARE @params VARCHAR(MAX), @emailData VARCHAR(MAX), 
                        @receptor VARCHAR(150), @fechaRegistro DATETIME,
                        @estado VARCHAR(5), @fechaEnvio DATETIME,
                        @idUsuario INT, @idNotificacion INT;

                DECLARE @subject VARCHAR(300), @body VARCHAR(MAX), 
                        @template VARCHAR(150), @cc VARCHAR(1000);

                -- Get current row data
                SELECT 
                    @idNotificacion = idNotificacion,
                    @params = params,
                    @emailData = emailData,
                    @receptor = receptor,
                    @fechaRegistro = fechaRegistro,
                    @estado = estado,
                    @fechaEnvio = fechaEnvio,
                    @idUsuario = idUsuario
                FROM #BatchToProcess
                WHERE RowNum = @currentRow;

                -- Get company details
                SELECT TOP 1 @companyId = idEntidad
                FROM v_usuario WITH (NOLOCK)
                WHERE idUsuarioRol = @idUsuario
                ORDER BY idUsuarioRol DESC;

                -- Determine email sender configuration with better caching
                SELECT TOP 1 @emailSenderConfigId = Id
                FROM Config.EmailSenderConfig WITH (NOLOCK)
                WHERE (CompanyId = @companyId OR (IsGlobal = 1 AND Enabled = 1))
                ORDER BY CASE WHEN CompanyId = @companyId THEN 0 ELSE 1 END;

                -- Parse email JSON data
                SELECT 
                    @subject = JSON_VALUE(@emailData, '$.subject'),
                    @body = JSON_VALUE(@emailData, '$.body'),
                    @template = JSON_VALUE(@emailData, '$.template'),
                    @cc = JSON_VALUE(@emailData, '$.cc');

                -- Insert notification
                INSERT INTO Common.Notification (
                    [NotificationTypeId], [CompressedParameters], [Title],
                    [Subject], [UserId], IsRead, CreatedAt, [FromMobile]
                )
                VALUES (
                    @notificationTypeId,
                    COMPRESS(ISNULL(@params, '{}')),
                    'Envio por correo',
                    @subject,
                    @idUsuario,
                    IIF(@estado = 'E', CAST(1 AS BIT), CAST(0 AS BIT)),
                    @fechaRegistro,
                    0
                );

                SET @notificationId = SCOPE_IDENTITY();

                -- Insert email queue
                INSERT INTO Common.EmailQueue (
                    [NotificationId], [EmailSenderConfigId], [RecipientEmail],
                    Cc, [Subject], [IsHtml], [CompressedBody], [PriorityId],
                    [StatusId], [SentAt], [Template], [CreatedAt], [UserId], [FromMobile]
                )
                VALUES (
                    @notificationId,
                    @emailSenderConfigId,
                    @receptor,
                    @cc,
                    ISNULL(@subject, 'Notificación por correo'),
                    CAST(0 AS BIT),
                    COMPRESS(ISNULL(@body, 'No Body')),
                    @priorityId,
                    CASE 
                        WHEN @estado = 'E' THEN (SELECT Id FROM Common.[Status] WITH (NOLOCK) WHERE Code = 'S')
                        WHEN @estado = 'NE' THEN (SELECT Id FROM Common.[Status] WITH (NOLOCK) WHERE Code = 'Q')
                        WHEN @estado = 'ERROR' THEN (SELECT Id FROM Common.[Status] WITH (NOLOCK) WHERE Code = 'F')
                    END,
                    @fechaEnvio,
                    @template,
                    @fechaRegistro,
                    @idUsuario,
                    0
                );

                SET @currentRow = @currentRow + 1;
                SET @ProcessedCount = @ProcessedCount + 1;
            END;

            -- Delete processed records
            DELETE FROM App.Notificacion
            WHERE idNotificacion IN (
                SELECT idNotificacion FROM #BatchToProcess
            );

            COMMIT TRANSACTION;

            -- Log progress
            RAISERROR('Processed %d notifications. Total processed: %d', 10, 1, 
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
    
    RAISERROR('Migration completed. Processed %d notifications in %d seconds with %d errors.', 
              10, 1, @ProcessedCount, @Duration, @ErrorCount) WITH NOWAIT;
END;
GO