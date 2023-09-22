USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-10
-- Description: sp for get restaurant menus
-- Restaurant.Promotion_Get 139, '', ''
-- =============================================
-- Restaurant.Promotion_Menu_Get_By_Id 139, 5, ''
CREATE OR ALTER PROCEDURE Restaurant.Promotion_Menu_Get_By_Id
@userRoleId     INT
,@id            INT
,@tableNames    VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    
    SET @tableNames = 'promotionMenus'
	SELECT pm.Id
           ,pm.PromotionId
           ,pm.MenuId
           ,m.Title
           ,iv.s3ObjectUrl
	FROM Restaurant.PromotionMenu pm WITH (NOLOCK)
    INNER JOIN Restaurant.Menu m ON m.Id = pm.MenuId
    INNER JOIN Inventario.v_Articulo iv ON iv.idArticulo = m.ProductId
    WHERE pm.PromotionId = @id
    AND ISNULL(pm.Deleted, 0) != 1
END
GO

