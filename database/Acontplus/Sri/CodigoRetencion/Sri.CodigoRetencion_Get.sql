

USE [AcontPlus];

IF OBJECT_ID('Sri.CodigoRetencion_Get')IS NOT NULL
	DROP PROCEDURE Sri.CodigoRetencion_Get
GO

CREATE PROCEDURE Sri.CodigoRetencion_Get  @json VARCHAR(200)
AS
BEGIN
	
	DECLARE @totalRecords INT = (SELECT COUNT(*) FROM Sri.CodigoRetencion)
	DECLARE @pageIndex INT;
	DECLARE @pageSize INT 

	SELECT
		@pageIndex = pageIndex,
		@pageSize  = pageSize
	FROM OPENJSON(@json)
	WITH(
		pageIndex INT '$.pageIndex',
		pageSize INT '$.pageSize'
	)

	SELECT 
		idCodigoRetencion,
		codigo,
		concepto,
		porcentajeMin,
		estado,
		totalRecords = @totalRecords
	FROM Sri.CodigoRetencion cr
	ORDER BY cr.idCodigoRetencion DESC
	OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY

END 