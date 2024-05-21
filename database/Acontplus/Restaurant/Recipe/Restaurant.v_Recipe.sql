USE Acontplus
GO
CREATE VIEW Restaurant.v_Recipe WITH SCHEMABINDING AS (
	
	SELECT  r.[Id]
		,r.[ItemId]
		,r.[IngredientId]
		,r.[Quantity]
		,r.[Unit]
		,r.[Instructions]
		,r.[Weight]
		,r.[NetWeight]
		,r.[CreatedAt]
		,r.[UpdatedAt]
		,r.[Enabled]
		,r.[Deleted]
		,r.[UserId]
		,a.idArticulo ProductId
		,a.descripcion ProductName
		,Ingredient = (
			SELECT aa.descripcion FROM dbo.Articulo aa WITH (NOLOCK) WHERE aa.idArticulo = ing.ProductId 
		)
	FROM Restaurant.Recipe r WITH (NOLOCK)
		INNER JOIN Restaurant.Item i WITH (NOLOCK) ON r.ItemId = i.Id
		INNER JOIN Restaurant.Ingredient ing WITH (NOLOCK) ON r.IngredientId = ing.Id
		INNER JOIN dbo.Articulo a WITH (NOLOCK) ON i.ProductId = a.idArticulo 
)

 