USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-09-11
-- Description: sp for get
-- =============================================
CREATE OR ALTER PROCEDURE Sri.ActividadEconomica_Get @userId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @tipo INT,
		@pageIndex INT,
		@pageSize INT,
		@textSearch VARCHAR(100);

	SELECT @tipo = tipo
		,@pageIndex = pageIndex
		,@pageSize = pageSize
		,@textSearch = textSearch
	FROM OPENJSON(@json) WITH (
								tipo INT,
								pageIndex INT,
								pageSize INT,
								textSearch VARCHAR(100)
								)

	SET @tableNames = 'activities'
	IF (@tipo = 1)
		BEGIN
			SELECT *,
			COUNT(*) OVER() AS TotalRecords
			FROM Sri.ActividadEconomica WITH(NOLOCK)
			ORDER BY idActividadEconomica DESC 
			OFFSET @pageSize*(@pageIndex-1) ROWS
			FETCH NEXT @pageSize ROWS ONLY;
			RETURN
		END

	IF (@tipo = 2)
		BEGIN
			SET @tableNames = 'tarifas'
			SELECT * FROM Sri.TarifaImpuesto WITH(NOLOCK) 
			WHERE estado = CAST(1 AS bit) 
				AND codImpuesto = 2
			RETURN
		END

	IF (@tipo = 3)
		BEGIN
			SELECT *,
			COUNT(*) OVER() AS TotalRecords
			FROM Sri.ActividadEconomica WITH(NOLOCK)
			WHERE descripcion LIKE '%' + @textSearch + '%'
				OR grupo LIKE '%'  +@textSearch + '%'
			ORDER BY idActividadEconomica DESC 
			OFFSET @pageSize*(@pageIndex-1) ROWS
			FETCH NEXT @pageSize ROWS ONLY;
			RETURN
		END
END
GO
