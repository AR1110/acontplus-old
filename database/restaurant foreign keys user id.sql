use acontplus
go
--SELECT top 1 * FROM Restaurant.[Order] with(nolock) order by Id desc

--select * from Restaurant.[Order] WITH(NOLOCK) WHERE userId NOT IN (SELECT idUsuario FROM dbo.Usuario)
 --select * from Restaurant.[OrderKitchen] WITH(NOLOCK) WHERE userId NOT IN (SELECT idUsuario FROM dbo.Usuario)

UPDATE oi set oi.userId = o.UserId 
FROM Restaurant.OrderKitchen oi with(rowlock)
INNER JOIN Restaurant.[order] O ON oi.OrderId = o.Id
WHERE oi.UserId <> O.UserId

ALTER TABLE Restaurant.[Order] 
ADD CONSTRAINT fk_order_rest_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)

ALTER TABLE Restaurant.[Floor]
ADD CONSTRAINT fk_floor_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.[Ingredient]
ADD CONSTRAINT fk_ingredient_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.IngredientType
ADD CONSTRAINT fk_ingredient_type_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.Item
ADD CONSTRAINT fk_item_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.ItemType
ADD CONSTRAINT fk_item_type_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.Menu
ADD CONSTRAINT fk_menu_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.MenuItem
ADD CONSTRAINT fk_menu_item_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.MenuType
ADD CONSTRAINT fk_menu_type_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.OrderDocument
ADD CONSTRAINT fk_order_document_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.OrderItem
ADD CONSTRAINT fk_order_item_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.OrderKitchen
ADD CONSTRAINT fk_order_kitchen_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.ProductionArea
ADD CONSTRAINT fk_production_area_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.Promotion
ADD CONSTRAINT fk_promotion_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.PromotionMenu
ADD CONSTRAINT fk_promotion_menu_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.Recipe
ADD CONSTRAINT fk_recipe_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.Room
ADD CONSTRAINT fk_room_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO

ALTER TABLE Restaurant.[Table]
ADD CONSTRAINT fk_table_user_id
FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario) 
GO


