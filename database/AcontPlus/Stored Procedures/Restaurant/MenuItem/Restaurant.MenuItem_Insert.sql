USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2023-13-10
-- Description: sp for update restaurant menus
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.MenuItem_Insert
@userRoleId INT
,@id        INT
,@menuItem  NVARCHAR(MAX)
,@response  NVARCHAR(300) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;
    DECLARE @date           DATETIME = (SELECT dbo.ufnGetDateEcuador())
            ,@userId        INT
            ,@productId     INT
            ,@totalPrecio   NUMERIC(18,5)
            ,@idTipoIva     INT
            ,@porcentaje    NUMERIC(18,5)
            ,@precioCosto   NUMERIC(18,5)
            ,@iva           VARCHAR(5)
    
    CREATE TABLE #MenuItem(
        id                  INT
        ,menuId             INT
        ,itemId             INT
        ,feeId              INT
        ,quantity           NUMERIC(18,5)
        ,discountPercent    NUMERIC(18,5)
        ,discountValue      NUMERIC(18,5)
        ,subTotal           NUMERIC(18,5)
    )

    IF ISJSON(@menuItem) = 0
        BEGIN 
            SET @response = (Common.ufnSpResponse('0', 'Formato incorrecto', NULL))
            RETURN
        END

    INSERT INTO #MenuItem(id, menuId, itemId, feeId, quantity, discountPercent,discountValue, subTotal)
    SELECT *
    FROM OPENJSON(@menuItem)
    WITH(
        id                  INT             '$.id'
        ,menuId             INT             '$.menuId'
        ,itemId             INT             '$.itemId'
        ,feeId              INT             '$.feeId'
        ,quantity           NUMERIC(18,5)   '$.quantity'
        ,discountPercent    NUMERIC(18,5)   '$.discountPercent'
        ,discountValue      NUMERIC(18,5)   '$.discountValue'
        ,subTotal           NUMERIC(18,5)   '$.subtotal'
    )

    SET @userId = (SELECT idUsuario FROM V_usuario WHERE idUsuarioRol = @userRoleId)

    INSERT INTO Restaurant.MenuItem(MenuId,ItemId,FeeId,Quantity,DiscountPercent,DiscountValue,SubTotal,CreatedAt,UpdatedAt,[Enabled],Deleted,UserId)
    SELECT @id
            , mi.itemId
            , mi.feeId
            , mi.quantity
            , mi.discountPercent
            , mi.discountValue
            , mi.subTotal
            , @date
            , NULL
            , 1 AS [Enabled] 
            , NULL
            ,@userId
    FROM #MenuItem mi
    WHERE mi.itemId NOT IN (SELECT ISNULL(rmi.ItemId, 0) FROM Restaurant.MenuItem rmi WHERE rmi.MenuId = @id)

    --- VERIFY EXISTS ---
    SELECT rmi.* INTO #MenuItemExits
    FROM Restaurant.MenuItem rmi
    WHERE rmi.MenuId = @id AND rmi.ItemId IN (SELECT mi.itemId FROM #MenuItem mi)

    --- VERIFY NOT EXISTS ---
    SELECT rmi.* INTO #MenuItemNoExits
    FROM Restaurant.MenuItem rmi
    WHERE rmi.MenuId = @id AND rmi.ItemId NOT IN (SELECT mi.itemId FROM #MenuItem mi)

    IF EXISTS(SELECT TOP 1 1 FROM #MenuItemExits)
        BEGIN
            UPDATE mri
            SET mri.ItemId              = mi.ItemId
                ,mri.FeeId              = mi.feeId
                ,mri.UpdatedAt          = @date
                ,mri.Quantity           = mi.quantity
                ,mri.DiscountPercent    = mi.discountPercent
                ,mri.DiscountValue      = mi.discountValue
                ,mri.SubTotal           = mi.subTotal
            FROM Restaurant.MenuItem mri
            INNER JOIN #MenuItemExits mie ON mie.MenuId = mri.MenuId
            INNER JOIN #MenuItem mi ON mi.itemId = mie.ItemId 
            WHERE mri.Id = mi.Id
        END

    IF EXISTS(SELECT TOP 1 1 FROM #MenuItemNoExits)
        BEGIN
            UPDATE mri
            SET mri.UpdatedAt  = @date
                ,mri.Deleted   = 1
            FROM Restaurant.MenuItem mri
            INNER JOIN #MenuItemNoExits mi ON mi.MenuId = mri.MenuId
            WHERE mri.Id = mi.Id
        END

        ---- UPDATE -----
        SELECT @productId       = ProductId
               ,@totalPrecio    = SUM(mi.Subtotal) 
        FROM Restaurant.MenuItem mi
        INNER JOIN Restaurant.Menu m on m.Id = mi.MenuId       
        WHERE m.Id = @id
        AND ISNULL(mi.Deleted, 0) != 1
        GROUP BY m.ProductId
          
        SELECT @porcentaje      = ISNULL(ti.porcentaje, 0)
                , @precioCosto  = ISNULL(precioCosto, 0)               
        FROM Inventario.v_Articulo ti 
        WHERE idArticulo = @productId

        DECLARE @totalIva NUMERIC(18,5)
                ,@precioVenta NUMERIC(18,5)
                ,@precioConIva NUMERIC(18,5)
                ,@porcentajeUtilidad NUMERIC(18,5)

        SET @totalIva = (@porcentaje / 100) + 1;
        SET @precioVenta = @totalPrecio / @totalIva;
        SET @precioConIva = @totalPrecio;
        SET @porcentajeUtilidad = ((@precioVenta / @precioCosto) * 100) - 1;
               
        UPDATE ap 
        SET ap.PrecioVenta          = @precioVenta
            ,ap.precioConIva        = @precioConIva
            ,ap.porcentajeUtilidad  = @porcentajeUtilidad
        FROM ArticuloPvP ap 
        WHERE ap.idArticulo = @productId 
        AND ap.precioPredeterminado = 1
END
GO

