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
CREATE OR ALTER PROCEDURE Restaurant.Promotion_Menu_Insert
@userRoleId     INT
,@promotionId   INT
,@promotionMenu NVARCHAR(MAX)
,@response      NVARCHAR(300) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;
    DECLARE @date           DATETIME = (SELECT dbo.ufnGetDateEcuador())
            ,@userId        INT
            
    
    CREATE TABLE #PromotionMenu(
        id                  INT      
        ,menuId             INT
    )

    INSERT INTO #PromotionMenu(id, menuId)
    SELECT *
    FROM OPENJSON(@promotionMenu)
    WITH(
        id      INT '$.id'
        ,menuId INT '$.menuId'
    )

    SET @userId = (SELECT idUsuario FROM V_usuario WHERE idUsuarioRol = @userRoleId)

    INSERT INTO Restaurant.PromotionMenu(PromotionId, MenuId, CreatedAt, UpdatedAt, Enabled, UserId)
    SELECT @promotionId
            , mi.menuId
            , @date
            , NULL
            , 1 AS [Enabled] 
            ,@userId
    FROM #PromotionMenu mi
    WHERE mi.MenuId NOT IN (SELECT ISNULL(rmi.MenuId, 0) FROM Restaurant.PromotionMenu rmi WHERE rmi.PromotionId = @promotionId)

    --- VERIFY EXISTS ---
    SELECT rmi.* INTO #PromotionMenuExists
    FROM Restaurant.PromotionMenu rmi
    WHERE rmi.PromotionId = @promotionId AND rmi.MenuId IN (SELECT mi.menuId FROM #PromotionMenu mi)

    --- VERIFY NOT EXISTS ---
    SELECT rmi.* INTO #PromotionMenuNoExits
    FROM Restaurant.PromotionMenu rmi
    WHERE rmi.PromotionId = @promotionId AND rmi.MenuId NOT IN (SELECT mi.menuId FROM #PromotionMenu mi)

    IF EXISTS(SELECT TOP 1 1 FROM #PromotionMenuExists)
        BEGIN
            UPDATE mri
            SET mri.MenuId  = mi.menuId                
            FROM Restaurant.PromotionMenu mri
            INNER JOIN #PromotionMenuExists mie ON mie.MenuId = mri.MenuId
            INNER JOIN #PromotionMenu mi ON mi.menuId = mie.MenuId
            WHERE mri.Id = mi.Id
        END

    IF EXISTS(SELECT TOP 1 1 FROM #PromotionMenuNoExits)
        BEGIN
            UPDATE mri
            SET mri.UpdatedAt  = @date
                ,mri.Deleted   = 1
            FROM Restaurant.PromotionMenu mri
            INNER JOIN #PromotionMenuNoExits mi ON mi.MenuId = mri.MenuId
            WHERE mri.Id = mi.Id
        END

    SET @response  = (SELECT 1)
END
GO