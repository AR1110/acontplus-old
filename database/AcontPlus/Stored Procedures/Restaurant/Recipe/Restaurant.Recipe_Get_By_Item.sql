GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update
--- Date: 2023-08-17
--- Restaurant.Recipe_Get_By_Item 139,17, ''
IF OBJECT_ID('Restaurant.Recipe_Get_By_Item') IS NOT NULL
   DROP PROC Restaurant.Recipe_Get_By_Item
GO 
CREATE PROC Restaurant.Recipe_Get_By_Item
@userRoleId INT
,@id INT
,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
SET NOCOUNT ON;
SET LANGUAGE SPANISH;
DECLARE @idEntidad INT

    SELECT TOP 1  @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT ri.ProductId
    INTO #selectProduct
    FROM Restaurant.Recipe rr
    INNER JOIN Restaurant.Ingredient ri ON ri.Id = rr.IngredientId
    WHERE rr.ItemId = @id AND ISNULL(rr.Deleted, 0) != 1
   

    SELECT iv.idArticulo                AS idArticulo
                    ,idMedida           AS idMedida
                    , medida            AS descripcion
                    , precioCosto       AS precioCosto   
    INTO #Measures
    FROM Inventario.v_Articulo iv
    INNER JOIN #selectProduct t1 ON t1.ProductId = iv.idArticulo
    WHERE iv.idArticulo = t1.ProductId
    AND iv.idEntidad = @idEntidad
    UNION           
    SELECT vaf.idArticulo                   AS idArticulo
            , vaf.idMedidaFraccionado       AS idMedida
            , vaf.medidaFraccionada         AS descripcion
            , vaf.precioCostoFraccionado    AS precioCosto
    FROM v_Articulo_Fraccionado vaf
    INNER JOIN #selectProduct t1 ON t1.ProductId = vaf.idArticulo
    WHERE vaf.idArticulo = t1.ProductId
    AND vaf.idEntidad = @idEntidad

           
    SET @tableNames = 'recipe'
    SELECT rr.Id
            ,rr.ItemId
            ,rr.Quantity
            ,rr.Unit
            ,rr.Instructions
            ,rr.Weight
            ,rr.NetWeight
            ,rr.Enabled
            ,rr.IngredientId
            ,ri.summary
            ,ISNULL(rr.ExtentId, 0) ExtentId 
            ,extents = (SELECT * FROM #Measures mr WHERE mr.idArticulo = ri.ProductId FOR JSON PATH)
    FROM Restaurant.Recipe rr
    INNER JOIN Restaurant.Ingredient ri ON ri.Id = rr.IngredientId
    WHERE rr.ItemId = @id AND ISNULL(rr.Deleted, 0) != 1

END