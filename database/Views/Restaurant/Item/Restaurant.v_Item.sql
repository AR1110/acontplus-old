USE Acontplus
GO

CREATE OR ALTER VIEW Restaurant.v_Item WITH SCHEMABINDING AS (
	SELECT i.Id
		,i.ProductId
		,i.ProductionAreaId
		,i.Summary
		,i.Cooking
		,i.Recipe
		,i.Instructions
		,i.Content
		,i.CreatedAt
		,i.UpdatedAt
		,i.[Enabled]
		,i.Deleted
		,i.UserId
		,a.idArticulo
        ,a.descripcion productName
	FROM Restaurant.Item i WITH (NOLOCK)
		INNER JOIN dbo.Articulo a WITH (NOLOCK) ON i.ProductId = a.idArticulo
)