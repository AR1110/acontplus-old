USE ACONTPLUS
GO

--Author: Ivan Paz
--Date: 2023-08-04
--Description: SP FOR GET INGREDIENTS
CREATE OR ALTER PROCEDURE Restaurant.Ingredient_Get
    @userRoleId INT,
    @json VARCHAR(MAX),
    @tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @tableNames = 'ingredients'
    SELECT *
    FROM Restaurant.Ingredient
END