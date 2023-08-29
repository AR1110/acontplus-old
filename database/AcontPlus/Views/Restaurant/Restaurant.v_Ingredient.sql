USE Acontplus
GO
CREATE OR ALTER VIEW Restaurant.v_Ingredient WITH SCHEMABINDING AS (
	
	SELECT i.[Id]
		,i.[ProductId]
		,i.[IngredientTypeId]
		,i.[Summary]
		,i.[Quantity]
		,i.[Unit]
		,i.[Content]
		,i.[CreatedAt]
		,i.[UpdatedAt]
		,i.[Enabled]
		,i.[Deleted]
		,i.[UserId]
		,it.[Name] IngredienType
		,a.descripcion ProductName
        ,ISNULL(a.llevaInventario, 0) Inventario
	FROM Restaurant.Ingredient i WITH (NOLOCK)
		INNER JOIN dbo.Articulo a WITH (NOLOCK) ON i.ProductId = a.idArticulo
		LEFT JOIN Restaurant.IngredientType it WITH (NOLOCK) ON i.IngredientTypeId = it.Id
)