
USE AcontPlus;

IF OBJECT_ID('Config.TipoEntidad_Get') IS NOT NULL
	DROP PROCEDURE Config.TipoEntidad_Get
GO
CREATE PROCEDURE Config.TipoEntidad_Get @idUsuarioRol INT, @json VARCHAR(400)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @totalRecords INT
	DECLARE @pageSize INT 
	DECLARE @pageIndex INT 

	SELECT 
		@pageIndex = pageIndex,
		@pageSize = pageSize
	FROM OPENJSON(@json)
	WITH(pageIndex int, pageSize int)

	SET @totalRecords = (SELECT COUNT(*) FROM dbo.TipoEntidad)
	SELECT 
		idTipoEntidad
		,descripcion
		,codigo
		,estado
		,fechaRegistro
		,totalRecords = ISNULL(@totalRecords, 0)
	FROM TipoEntidad
	ORDER BY idTipoEntidad DESC
	OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
				
END 