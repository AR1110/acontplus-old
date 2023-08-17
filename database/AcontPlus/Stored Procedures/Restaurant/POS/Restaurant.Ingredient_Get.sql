USE ACONTPLUS
GO

--Author: Ivan Paz - Ignacio Manchu.
--Date: 2023-08-04
--Description: SP FOR GET INGREDIENTS
-- Restaurant.Ingredient_Get 0, '{}', ''
CREATE OR ALTER PROCEDURE Restaurant.Ingredient_Get
    @userRoleId INT,
    @json VARCHAR(MAX),
    @tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @tableNames = 'ingredients'
    SELECT ri.*
           ,productDescription = va.descripcion
           ,s3ObjectUrl        = ISNULL(va.s3ObjectUrl, '')
    FROM Restaurant.Ingredient ri
    INNER JOIN v_Articulo va ON va.idArticulo = ri.ProductId
END