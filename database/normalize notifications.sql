USE Acontplus
GO
DROP PROC IF EXISTS Config.WhatsAppMessage_Insert
GO
DROP PROC IF EXISTS Config.WhatsAppMessage_Insert_v2
GO
DROP PROC IF EXISTS [Config].[WhatsappUsage_Insert]
GO
DROP PROC IF EXISTS  [Config].[WhatsAppUsage_Update]
GO

IF NOT EXISTS (SELECT 1 FROM AcontplusAdmin.Config.WhatsAppUsage)
    BEGIN
        INSERT INTO AcontplusAdmin.Config.WhatsAppUsage(CompanyId, Used, Limit, Unlimited, StartDate, EndDate, Enabled, UserId, CreatedAt)
        SELECT c.Id, ISNULL(wau.used, 0), ISNULL(wau.limite, 0), wau.ilimitado, wau.fechaInicio, wau.fechaFin, wau.estado, wau.idUsuario, c.CreatedAt
        FROM Acontplus.Config.WhatsappUsage wau 
        INNER JOIN Config.Company c ON wau.ruc = c.idcard
        ORDER BY c.Id
    END
GO

IF NOT EXISTS (SELECT 1 FROM Config.WhatsAppSenderConfig)
    BEGIN
        INSERT INTO Config.WhatsAppSenderConfig([IsGlobal], [AccountId], [AuthToken], [UrlService], [UserId])
        VALUES(CAST(1 AS BIT), '7103845341', 'a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c', 'https://api.green-api.com/waInstance', 1 )
    END
GO

IF EXISTS (SELECT 1 FROM AcontplusAdmin.Config.WhatsAppUsage)
    BEGIN
        DROP TABLE IF EXISTS Config.WhatsappUsage
    END

--SELECT * FROM Config.WhatsAppSenderConfig

--SELECT * FROM AcontplusAdmin.Config.Whatsappusage