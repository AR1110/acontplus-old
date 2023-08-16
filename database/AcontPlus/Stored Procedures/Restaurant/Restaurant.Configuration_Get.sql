USE AcontPlus
GO 
--- Author: Ignacio Manchu - Ignacio Manchu
--- Date: 2023-08-15
--- Description: Listado general de configuraciones para módulo de ventas - Restaurante.

--- Restaurant.Configuration_Get 139, '{"codEstab":"ESTAB-000000117"}', ''
IF OBJECT_ID(N'Restaurant.Configuration_Get', N'P') IS NOT NULL
	DROP PROCEDURE Restaurant.Configuration_Get
GO
CREATE PROCEDURE Restaurant.Configuration_Get
@userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @codEstab VARCHAR(20)
    
	SELECT TOP 1  @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
	SELECT @codEstab = codEstab FROM OPENJSON(@json) WITH(codEstab VARCHAR(20)  '$.codEstab')

	SET @tableNames = 'Table,ConfigDecimal,SubCategorias'
	SELECT rt.* FROM Restaurant.v_Table rt
	INNER JOIN Restaurant.v_Room rr ON rr.id = rt.roomId
	INNER JOIN Restaurant.v_Floor rf ON rf.id = rr.floorId
	WHERE rf.codEstab = @codEstab
	   
	SELECT * FROM v_ConfigDecimal WHERE idEntidad = @idEntidad AND codTrasaccion = 'V'

    SELECT
		idSubFamilia    = sf.idSubFamilia
		,idFamilia      = ISNULL(sf.idFamilia,0)
		,descripcion    = sf.descripcion
		,estado         = sf.estado
		,siglas         = sf.siglas
		,codigo         = sf.codigo
		,montoObjetivo  = ISNULL(sf.montoObjetivo,0)
		,nombreFamilia  = ISNULL(f.descripcion, 'Ninguna')	
	FROM SubFamilia  sf
	LEFT JOIN Familia f ON f.idFamilia = sf.idFamilia
	WHERE sf.idEntidad = @idEntidad
	AND sf.applicationId IS NOT NULL
    ORDER BY sf.idSubFamilia DESC    
END
GO