USE AcontPlus
GO 
--- Author: Ignacio Manchu - Ignacio Manchu
--- Date: 2023-08-15
--- Description: Listado general de configuraciones para módulo de ventas - Restaurante.

--- Restaurant.Catalog_Get 139, '{"codEstab:" "0756767"}', ''
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

	SET @tableNames = 'Table'
	SELECT rt.* FROM Restaurant.v_Table rt
	INNER JOIN Restaurant.v_Room rr ON rr.id = rt.roomId
	INNER JOIN Restaurant.v_Floor rf ON rf.id = rr.floorId
	WHERE rf.codEstab = @codEstab
	   
	SET @tableNames = 'ConfigDecimal'
	SELECT * FROM v_ConfigDecimal WHERE idEntidad = @idEntidad

END
GO