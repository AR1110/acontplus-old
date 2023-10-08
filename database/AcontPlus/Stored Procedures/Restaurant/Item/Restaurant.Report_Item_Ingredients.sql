USE [AcontPlus]
GO
/****** Object:  StoredProcedure [ReporteIngresos].[CarteraCliente]    Script Date: 3/5/2023 11:08:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Restaurant.Report_Item_Ingredients 139, '{"codEstab":"ESTAB-000000117","idSubfamilia":0}'
CREATE OR ALTER PROC Restaurant.Report_Item_Ingredients
@idUsuarioRol INT
,@json      VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    DECLARE @idEntidad INT;
    ---Params    
    DECLARE @codEstab VARCHAR(100)
    DECLARE @idSubfamilia INT 
    DECLARE @itemId INT  

    DECLARE @sql NVARCHAR(MAX) 
    DECLARE @params nvarchar(max) = '@idEntidad int,
									 @itemId int,
									 @idSubfamilia int'
    SELECT 
        @codEstab = codEstab 
        ,@idSubfamilia = idSubfamilia 
        ,@itemId = itemId
    FROM OPENJSON(@json)
    WITH(
        codEstab VARCHAR(100) '$.codEstab'
        ,idSubfamilia INT '$.idSubfamilia'
        ,itemId INT '$.itemId'
    ) 

    SELECT top 1 @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol =  @idUsuarioRol
    SELECT TOP 1 @codEstab = codEstab
    FROM v_Estab_Asign WHERE idUsuarioRol = @idUsuarioRol
 
    SELECT  
        v_ea.ruc
        ,companyName      = v_u.entidad
        ,estabName        = v_ea.nombreComercial
        ,estabPhoneNumber = v_ea.telefono
        ,estabAddress     = v_ea.correo
        ,userName         = v_ea.usuario
    FROM v_Estab_Asign v_ea WITH(NOLOCK)
    INNER JOIN v_usuario v_u WITH(NOLOCK) ON v_u.idUsuarioRol = v_ea.idUsuarioRol
    WHERE v_ea.codEstab = @codEstab
                
    --SELECT ri.Summary
    --    ,ri.CreatedAt        
    --FROM Restaurant.Recipe rr    
    --INNER JOIN Restaurant.Item ri ON ri.Id = rr.ItemId
    --INNER JOIN Inventario.v_Articulo a ON a.idArticulo = ri.ProductId
    --INNER JOIN Restaurant.Ingredient rin ON rin.Id = rr.IngredientId

    --SELECT top 10 * FROM Restaurant.Item
    SET @sql = '
                SELECT 
                    --Item 
                    itemId = recip.ItemId
                    ,itemProductCode  = item_va.codigo
                    ,itemProductName = item_va.descripcion
                    ,itemProductCategory = item_va.subFamilia
                    ,recipe = item.Recipe
                    --Ingredients
                    ,ingredientId = recip.IngredientId
                    ,ingredientProductCode = ing_va.codigo
                    ,ingredientProductName = ing_va.descripcion
                    ,ingredientProductMeasure = m.descripcion
                    ,[weight] = CAST(recip.[Weight] AS NUMERIC(18,2))
                    ,quantity = CAST(recip.Quantity AS NUMERIC(18,2))
                    ,costPrice = CAST(recip.CostPrice AS NUMERIC(18,2))
                    ,total     = CAST((recip.Quantity * recip.CostPrice) AS NUMERIC(18,2))
                FROM Restaurant.Recipe recip WITH(NOLOCK)
                INNER JOIN Restaurant.Item item WITH(NOLOCK) ON item.Id = recip.ItemId
                INNER JOIN Inventario.v_Articulo item_va WITH(NOLOCK) ON item_va.idArticulo = item.ProductId
                --Ingredients
                INNER JOIN Restaurant.Ingredient ing WITH(NOLOCK) ON ing.Id = recip.IngredientId
                INNER JOIN Inventario.v_Articulo ing_va WITH(NOLOCK) ON ing_va.idArticulo = ing.ProductId
                INNER JOIN dbo.Medida m WITH(NOLOCK) on m.idMedida = recip.ExtentId 
                WHERE item_va.idEntidad = @idEntidad AND  recip.Deleted IS NULL'

    IF (@itemId > 0 )
        BEGIN 
            SET @sql = @sql + ' AND recip.ItemId = @itemId '
        END

    IF (@idSubfamilia > 0 )
        BEGIN 
            SET @sql = @sql + ' AND item_va.idSubfamilia = @idSubfamilia '
        END 

        SET @sql = @sql + ' order by recip.id, ing.IngredientTypeId ASC '


    EXEC sp_executesql 
		 @sql
		,@params 	
		,@idEntidad = @idEntidad
		,@itemId  = @itemId
		,@idSubfamilia = @idSubfamilia
END