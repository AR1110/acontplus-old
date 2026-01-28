USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		 
-- Create date:  
-- Description:	 
-- =============================================

DROP PROC IF EXISTS [Config].[EmailConfig_Get]
GO

CREATE OR ALTER   PROCEDURE [Config].[EmailSenderConfig_Get] @UserRoleId INT,
@Json VARCHAR(MAX),
@TableNames VARCHAR(500) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;   
	DECLARE @Tipo INT 

	SELECT @Tipo = tipo FROM OPENJSON(@Json) WITH (tipo INT)

    --> Get
	IF @Tipo = 1
		BEGIN
			SET @TableNames = 'emailSenderConfigs'
			SELECT [Id]
				,[CompanyId]
				,[IsGlobal]
				,[SenderEmail]
				,[SenderName]
				,[SmtpServer]
				,[SmtpPort]
				,[UseSsl]
				,[Username]
				,[IsActive]
			FROM Config.EmailSenderConfig
            RETURN 
		END
END
