USE Acontplus
GO
/****** Object:  StoredProcedure [Sri].[CodigoRetencion_Get]    Script Date: 12/6/2024 14:30:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [Sri].[CodigoRetencion_Get]  @json VARCHAR(200),@tableNames VARCHAR(MAX) OUTPUT
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

	SET @tableNames='codigosRetencion'
	SELECT 
		idCodigoRetencion,
		codigo,
		concepto,
		porcentajeMin,
		porcentajeMax = ISNULL(porcentajeMax, 0),
		estado,
		totalRecords = @totalRecords
	FROM Sri.CodigoRetencion cr
	ORDER BY cr.idCodigoRetencion DESC
	OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY

END 