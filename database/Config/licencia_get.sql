USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-11-24
-- Description:	sp for get licences
-- =============================================
CREATE OR ALTER PROCEDURE Config.Licencia_Get @json VARCHAR(MAX) ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @tipo INT
	SET @tipo = (SELECT tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo'))

	IF (@tipo = 1)
		BEGIN
			SET @tableNames = 'licencias'
			SELECT l.*
				, lt.Code licenseTypeCode
				, lt.[Name] licenseType
			FROM Config.Licencia l  WITH (NOLOCK)
			INNER JOIN Config.LicenseType lt WITH (NOLOCK) ON l.LicenseTypeId = lt.Id
			WHERE l.IsDeleted = CAST(0 AS BIT)
		END

	IF (@tipo = 2)
		BEGIN
			SET @tableNames = 'licenseTypes,sistemas,aplicaciones'
			SELECT * FROM Config.LicenseType WITH (NOLOCK) WHERE IsDeleted = CAST(0 AS BIT)
			SELECT * FROM Config.Sistema WITH (NOLOCK) WHERE IsDeleted = CAST(0 AS BIT)
			SELECT * FROM Config.Aplicacion WITH (NOLOCK) WHERE IsDeleted = CAST(0 AS BIT)
		END


END
GO
