USE AcontplusAdmin
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2023-11-24
-- Description:	sp for get licences
-- Config.Licencia_Detalle_Get '{"tipo": 2, "id": 1}', ''
-- =============================================
CREATE OR ALTER PROCEDURE Config.Licencia_Detalle_Get @json VARCHAR(MAX) ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @tipo INT
		,@id INT
		,@licenciaId INT

	SELECT  @tipo = tipo
		,@id = id
		,@licenciaId = licenciaId
	FROM OPENJSON(@json) WITH (tipo INT '$.tipo',
									id INT '$.id',
									licenciaId INT)

	IF (@tipo = 1)
		BEGIN
			SET @tableNames = 'licenciaDetalle'
			SELECT l.*
				, a.Name
			FROM Config.LicenciaDetalle l
			INNER JOIN Config.Aplicacion a WITH(NOLOCK) ON a.Id = l.AplicacionId
			WHERE l.LicenciaId = @id AND l.IsDeleted = CAST(0 AS BIT)
		END

	IF (@tipo = 2)
		BEGIN
			SET @tableNames = 'licenciaDetails'
			SELECT ld.Id				AS LicenciaDetalleId
				, ld.LicenciaId
				, ld.AplicacionId
				, ld.Cost
				, ISNULL(ld.Tax, 0)		AS Tax				
				, a.[Name]				AS ApplicationName
				,lt.[name] LicenseName
			FROM Config.LicenciaDetalle ld
			INNER JOIN Config.Licencia l ON ld.LicenciaId = l.Id
			INNER JOIN Config.LicenseType lt ON l.licenseTypeId = lt.Id
			INNER JOIN Config.Aplicacion a WITH(NOLOCK) ON a.Id = ld.AplicacionId
			WHERE ld.LicenciaId = @licenciaId AND ld.IsDeleted = CAST(0 AS BIT)
		END
END
GO
