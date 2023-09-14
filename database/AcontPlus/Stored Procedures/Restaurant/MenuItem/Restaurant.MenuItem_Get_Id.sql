USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu 
-- Create date: 2023-13-08
-- Description:	sp for get menu items by Id
-- =============================================
-- Restaurant.MenuItem_Get_Id  139, 2, ''
CREATE OR ALTER PROCEDURE Restaurant.MenuItem_Get_Id 
@userRoleId INT
,@id INT
,@tableNames varchar(max) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

    SET @tableNames = 'menuItems'
	SELECT rmi.Id
        ,rmi.ItemId
        ,ri.ProductId
        ,ia.precioCosto                     AS CostPrice
        ,ia.descripcion
        ,rmi.MenuId
        ,ISNULL(rmi.Quantity, 0)            AS Quantity
        ,ISNULL(rmi.PercentageDiscount, 0)  AS PercentageDiscount
        ,ISNULL(rmi.Total, 0)               AS Total
	FROM Restaurant.MenuItem rmi
    INNER JOIN Restaurant.Item ri ON ri.Id = rmi.ItemId
    INNER JOIN Inventario.v_Articulo ia ON ia.idArticulo = ri.ProductId
	WHERE rmi.MenuId = @id
END
GO