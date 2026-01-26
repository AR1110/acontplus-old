USE Acontplus
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Sri')
BEGIN
    EXEC('CREATE SCHEMA Sri')
END

-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04
-- Description:	sp for get tarifa impuestos
-- =============================================
CREATE OR ALTER PROCEDURE Sri.TarifaImpuesto_Get @json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @tipo INT

	SELECT @tipo = tipo FROM OPENJSON (@json) WITH (tipo INT)

	IF (@tipo = 1)
		BEGIN
			SET @tableNames = 'tarifas'
			SELECT * FROM Sri.TarifaImpuesto WITH (NOLOCK)
		END
	
	IF (@tipo = 2)
		BEGIN
			SET @tableNames = 'impuestos'
			SELECT * FROM Sri.Impuesto WITH (NOLOCK)
		END

END
GO
