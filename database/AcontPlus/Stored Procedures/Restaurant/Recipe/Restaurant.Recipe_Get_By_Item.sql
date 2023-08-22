GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update
--- Date: 2023-08-17
--- Restaurant.Recipe_Get_By_Item 1, ''
IF OBJECT_ID('Restaurant.Recipe_Get_By_Item') IS NOT NULL
   DROP PROC Restaurant.Recipe_Get_By_Item
GO 
CREATE PROC Restaurant.Recipe_Get_By_Item
@id INT
,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
SET NOCOUNT ON;
SET LANGUAGE SPANISH;

    SET @tableNames = 'recipe'
    SELECT id               = rr.Id
            , itemId        = rr.ItemId
            , quantity      = rr.Quantity
            , unit          = rr.Unit
            , instructions  = rr.Instructions
            , weight        = rr.Weight
            , netWeight     = rr.NetWeight
            , enabled       = rr.Enabled
            , ingredientId  = rr.IngredientId
            , summary       = ri.summary
    FROM Restaurant.Recipe rr
    INNER JOIN Restaurant.Ingredient ri ON ri.Id = rr.IngredientId
    WHERE rr.ItemId = @id
END