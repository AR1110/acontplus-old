-- 1) Listado de FKs cuyo *parent* (tabla que contiene la FK) pertenece al schema 'Restaurant'
--    y cuya columna FK se llama 'UserId'
SELECT
    fk.object_id AS ForeignKeyObjectId,
    fk.name AS ForeignKeyName,
    sch.name AS ParentSchema,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    rs.name AS ReferencedSchema,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn,
    -- instrucci�n DROP (lista lista para ejecutar)
    'ALTER TABLE [' + sch.name + '].[' + tp.name + '] DROP CONSTRAINT [' + fk.name + '];' AS DropStatement
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
INNER JOIN sys.schemas sch ON tp.schema_id = sch.schema_id            -- schema de la tabla que posee la FK
INNER JOIN sys.schemas rs ON tr.schema_id = rs.schema_id             -- schema de la tabla referenciada
WHERE sch.name = 'Restaurant'      -- <-- filtro: tablas que pertenecen al schema Restaurant
  AND cp.name = 'UserId'           -- <-- filtro: la columna FK se llama UserId
ORDER BY tp.name, fk.name;

GO

--ALTER TABLE [Restaurant].[Floor] DROP CONSTRAINT [fk_floor_user_id];
--ALTER TABLE [Restaurant].[Ingredient] DROP CONSTRAINT [fk_ingredient_user_id];
--ALTER TABLE [Restaurant].[IngredientType] DROP CONSTRAINT [fk_ingredient_type_user_id];
--ALTER TABLE [Restaurant].[Item] DROP CONSTRAINT [fk_item_user_id];
--ALTER TABLE [Restaurant].[ItemType] DROP CONSTRAINT [fk_item_type_user_id];
--ALTER TABLE [Restaurant].[Menu] DROP CONSTRAINT [fk_menu_user_id];
--ALTER TABLE [Restaurant].[MenuItem] DROP CONSTRAINT [fk_menu_item_user_id];
--ALTER TABLE [Restaurant].[MenuType] DROP CONSTRAINT [fk_menu_type_user_id];
--ALTER TABLE [Restaurant].[Order] DROP CONSTRAINT [fk_order_rest_user_id];
--ALTER TABLE [Restaurant].[OrderDocument] DROP CONSTRAINT [fk_order_document_user_id];
--ALTER TABLE [Restaurant].[OrderItem] DROP CONSTRAINT [fk_order_item_user_id];
--ALTER TABLE [Restaurant].[OrderKitchen] DROP CONSTRAINT [fk_order_kitchen_user_id];
--ALTER TABLE [Restaurant].[ProductionArea] DROP CONSTRAINT [fk_production_area_user_id];
--ALTER TABLE [Restaurant].[Promotion] DROP CONSTRAINT [fk_promotion_user_id];
--ALTER TABLE [Restaurant].[PromotionMenu] DROP CONSTRAINT [fk_promotion_menu_user_id];
--ALTER TABLE [Restaurant].[Recipe] DROP CONSTRAINT [fk_recipe_user_id];
--ALTER TABLE [Restaurant].[Room] DROP CONSTRAINT [fk_room_user_id];
--ALTER TABLE [Restaurant].[Table] DROP CONSTRAINT [fk_table_user_id];
--ALTER TABLE [Restaurant].[Order] DROP CONSTRAINT [fk_estab_order];
