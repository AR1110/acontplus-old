GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update
--- Date: 2023-08-17
--- Restaurant.Recipe_Get_By_Item 3, ''
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
    FROM Restaurant.Recipe rr
    INNER JOIN Restaurant.Ingredient ri ON ri.Id = rr.IngredientId
    WHERE rr.ItemId = @id AND ISNULL(rr.Deleted, 0) != 1

END