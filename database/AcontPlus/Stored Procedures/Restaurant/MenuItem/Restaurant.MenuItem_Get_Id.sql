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
-- Restaurant.MenuItem_Get_Id  139, 3, ''
CREATE OR ALTER PROCEDURE Restaurant.MenuItem_Get_Id 
@userRoleId INT
,@id INT
,@tableNames VARCHAR(max) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

    SELECT i.ProductId
    INTO #Products
    FROM Restaurant.MenuItem mi
    INNER JOIN Restaurant.Item i ON i.Id = ItemId
    WHERE mi.MenuId = @id
       
    SELECT  iat.idArticuloPvP
		    ,iat.idArticulo
		    ,iat.idTarifa
		    ,iat.precioConIva
		    ,iat.precioVenta
		    ,iat.precioPredeterminado
		    ,iat.stock
		    ,iat.tarifa
    INTO #Tarifas
    FROM Inventario.v_Articulo_Tarifa iat
    INNER JOIN #Products pr ON pr.ProductId = iat.idArticulo
    WHERE iat.idArticulo = pr.ProductId

    SET @tableNames = 'menuItems'
	SELECT rmi.Id
        ,rmi.ItemId
        ,ri.ProductId
        ,ia.precioCosto                     AS CostPrice
        ,ia.descripcion
        ,ia.codigo                          AS Codigo
        ,ia.medida                          AS Medida
        ,rmi.MenuId
        ,ISNULL(rmi.Quantity, 0)            AS Quantity
        ,ISNULL(rmi.DiscountPercent, 0)     AS DiscountPercent
        ,ISNULL(rmi.DiscountValue, 0)       AS DiscountValue
        ,ISNULL(rmi.FeeId, 0)               AS FeeId
        ,ISNULL(rmi.subtotal, 0)            AS Subtotal
        ,fees                               = (SELECT * FROM #Tarifas t1 WHERE t1.idArticulo = ri.ProductId FOR JSON PATH)
	FROM Restaurant.MenuItem rmi
    INNER JOIN Restaurant.Item ri ON ri.Id = rmi.ItemId
    INNER JOIN Inventario.v_Articulo ia ON ia.idArticulo = ri.ProductId
	WHERE rmi.MenuId = @id
END
GO