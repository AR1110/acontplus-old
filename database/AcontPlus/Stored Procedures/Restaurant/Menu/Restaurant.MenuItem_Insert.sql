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
    DECLARE @date    DATETIME = (SELECT dbo.ufnGetDateEcuador())
            ,@userId INT
    
    CREATE TABLE #MenuItem(
        id                  INT
        ,menuId             INT
        ,itemId             INT
        ,quantity           NUMERIC(18,5)
        ,percentajeDiscount NUMERIC(18,5)
        ,total              NUMERIC(18,5)
    )

    IF ISJSON(@menuItem) = 0
        BEGIN 
            SET @response = (Common.ufnSpResponse('0', 'Formato incorrecto', NULL))
            RETURN
        END

    INSERT INTO #MenuItem(id, menuId, itemId, quantity, percentajeDiscount, total)
    SELECT *
    FROM OPENJSON(@menuItem)
    WITH(
        id                  INT             '$.id'
        ,menuId             INT             '$.menuId'
        ,itemId             INT             '$.itemId'
        ,quantity           NUMERIC(18,5)   '$.quantity'
        ,percentajeDiscount NUMERIC(18,5)   '$.percentageDiscount'
        ,total              NUMERIC(18,5)   '$.total'
    )

    SET @userId = (SELECT idUsuario FROM V_usuario WHERE idUsuarioRol = @userRoleId)

    INSERT INTO Restaurant.MenuItem(MenuId, ItemId, CreatedAt, UpdatedAt, [Enabled], Deleted, UserId, Quantity, PercentageDiscount, Total)
    SELECT @id
            , mi.itemId
            , @date
            , NULL
            , 1 AS [Enabled] 
            , NULL
            ,@userId
            ,mi.quantity
            ,mi.percentajeDiscount
            ,mi.total
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
                ,mri.UpdatedAt          = @date
                ,mri.Quantity           = mi.quantity
                ,mri.PercentageDiscount = mi.percentajeDiscount
                ,mri.Total              = mi.total
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
END
GO

