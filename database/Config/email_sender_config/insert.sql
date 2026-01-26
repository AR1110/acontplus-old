USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Ivan Paz
-- Create date: 2024-12-17
-- Description:	 
-- =============================================

CREATE OR ALTER PROCEDURE [Config].[EmailSenderConfig_Insert] @UserId INT,
@Json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;  
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;

	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Acontplus.Config.EmailSenderConfig([CompanyId], [IsGlobal], [SenderEmail], [SenderName],
			[SmtpServer], [SmtpPort], [UseSsl], [Username], [EncryptedPassword], [PasswordHash], [UserId], [FromMobile])
			SELECT companyId, isGlobal, senderEmail, senderName,
			smtpServer, smtpPort, useSsl, username, encryptedPassword, passwordHash, @UserId, 0
			FROM OPENJSON(@Json) WITH (
									companyId INT,
									isGlobal BIT,
									senderEmail VARCHAR(150),
									senderName VARCHAR(300),
									smtpServer VARCHAR(150),
									smtpPort INT, 
									useSsl BIT, 
									username VARCHAR(150),
									encryptedPassword VARBINARY(MAX),
									passwordHash VARCHAR(MAX)
			)
		COMMIT TRAN;

		SELECT '0' code, 'Registrado Exitosamente' AS 'message';
	END TRY
	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN;
			END

			SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
            EXEC dbo.LogError
                @ModuleName = 'CONFIG',
                @BusinessProcess = 'EMAIL_SENDER_CONFIG_INSERT',
                @ErrorCategory = 'BUSINESS_RULE',
                @ErrorSeverityLevel = 'HIGH',
                @ResponseTime = @ResponseTime,
                @EnvironmentName = 'PROD',
                @BuildVersion = '3.0.0';
			SELECT '0' code, 'Error in procedure' AS 'message'
	END CATCH

END
