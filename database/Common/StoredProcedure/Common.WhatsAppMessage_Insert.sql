USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2023-05-08
-- Description:	 
-- =============================================
CREATE OR ALTER PROCEDURE Common.WhatsAppMessage_Insert @userRoleId INT
,@json VARCHAR(MAX)
,@fromMobile BIT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @userId INT
    ,@companyId INT
    ,@companyUuid UNIQUEIDENTIFIER
	,@notificationTypeId INT
    ,@notificationId INT
    ,@whatsAppSenderConfigId INT
    ,@priorityId INT
    ,@statusId INT;

	DECLARE @tbl AS TABLE (
	    browser VARCHAR(MAX),
	    os VARCHAR(MAX),
	    emisor VARCHAR(100) NOT NULL,
	    receptor VARCHAR(50) NOT NULL,
	    mensaje VARCHAR(100) NOT NULL,
	    totalMensajes INT NOT NULL,
	    params VARCHAR(MAX) NULL
	)
	declare @browser VARCHAR(300)
	declare @os VARCHAR(300)
	
	declare @browserName VARCHAR(300)
	declare @osName VARCHAR(300)


	BEGIN TRY
        SELECT @userId = idUsuario, @companyId = idEntidad, @companyUuid = uuid FROM v_usuario WHERE idUsuarioRol = @userRoleId

        SET @notificationTypeId = (SELECT TOP 1 Id FROM Common.NotificationType WHERE code = 'WA')

        IF NOT EXISTS (SELECT 1 FROM Config.WhatsAppSenderConfig WHERE CompanyId = @companyId)
            BEGIN 
                SET @whatsAppSenderConfigId = (SELECT TOP 1 Id FROM Config.WhatsAppSenderConfig WHERE IsGlobal = 1 AND IsActive = 1)
            END

        SET @priorityId = (SELECT Id FROM Common.[Priority] WHERE Code = 'H')

        SET @statusId = (SELECT Id FROM Common.[Status] WHERE Code = 'S')

	    INSERT INTO @tbl(browser, os, emisor, receptor, mensaje, totalMensajes, params)
	    SELECT browser, LTRIM(RTRIM(os)), ISNULL(emisor, ''), receptor, mensaje, totalMensajes, params 
        FROM  OPENJSON(@JSON) 
	    WITH (browser VARCHAR(MAX) '$.browser'
		    ,os VARCHAR(MAX) '$.os'
		    ,emisor VARCHAR(100) '$.emisor'
		    ,receptor VARCHAR(50) '$.receptor'
		    ,mensaje VARCHAR(100) '$.mensaje'
		    ,totalMensajes INT '$.totalMensajes'
		    ,params VARCHAR(2000) '$.params'
		    )

	    SELECT @browser = browser, @os = os FROM @tbl

	    SET @browserName = (SELECT bname  + '_' + bversion FROM OPENJSON (@browser) WITH (bname VARCHAR(300) '$.name', bversion VARCHAR(300) '$.version'))
	    
        IF (@os IS NOT NULL)
            SET @osName = (SELECT oname  + '_' + oversion FROM OPENJSON (@os) WITH (oname VARCHAR(300) '$.name', oversion VARCHAR(300) '$.version'))

		BEGIN TRAN
            INSERT INTO Common.[Notification]([NotificationTypeId], [CompressedParameters], [Title], [IsRead], [CreatedByUserId], [FromMobile])
            SELECT TOP 1 @notificationTypeId, COMPRESS(params), 'Mensaje de WhatsApp', CAST(1 AS BIT), @userId, @fromMobile 
            FROM @tbl

            SET @notificationId = SCOPE_IDENTITY()

            INSERT INTO Common.WhatsAppMessage([NotificationId], [WhatsAppSenderConfigId], [CompressedMessage], [Os], [Browser],
            [RecipientPhoneNumber], [PriorityId], [StatusId], [SentAt], [CreatedByUserId], [FromMobile])
			
            SELECT @notificationId, @whatsAppSenderConfigId, COMPRESS(mensaje), @osName, @browserName,
            receptor, @priorityId, @statusId, dbo.ufnGetDateEcuador(), @userId, @fromMobile
            FROM @tbl

			UPDATE wau
            SET wau.used = used +
                    (SELECT totalMensajes FROM @tbl)
            FROM Config.WhatsappUsage  wau
                INNER JOIN Config.Company c ON wau.CompanyId  = c.Id
            WHERE c.Uuid = @companyUuid

            DECLARE @limit INT

			SELECT @limit = Limit FROM Config.WhatsappUsage wau 
                                INNER JOIN Config.Company c ON wau.CompanyId  = c.Id
                                WHERE c.Uuid = @companyUuid

			IF EXISTS(SELECT 1 FROM Config.WhatsappUsage wau 
                                INNER JOIN Config.Company c ON wau.CompanyId  = c.Id
                                WHERE c.Uuid = @companyUuid 
                                    AND used >= @limit 
                                    AND [Unlimited] = 0)
				BEGIN
					UPDATE Config.WhatsappUsage 
                    SET EndDate = dbo.ufnGetDateEcuador(),
                    [IsActive] = 0 
                    FROM Config.WhatsappUsage  wau
                    INNER JOIN Config.Company c ON wau.CompanyId = c.Id
                    WHERE c.Uuid = @companyUuid
				END
		COMMIT TRAN
        SELECT '1' code, 'El mensaje se envio correctamente' as 'message'
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error al registrar el envio' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN

		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'WhatsappMessage/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH 
END
