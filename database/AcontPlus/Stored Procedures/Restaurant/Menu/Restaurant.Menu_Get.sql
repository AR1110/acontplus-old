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
-- Restaurant.Menu_Get 139, '', ''
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Menu_Get @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    
    SET @tableNames = 'menus,menuTypes,promotionDays'
	SELECT m.Id
        ,m.ProductId
        ,m.Title
        ,m.Summary
        ,m.MenuTypeId
        ,m.Content
        ,FORMAT(m.StartDate, 'yyyy-MM-dd')  AS StartDate
        ,FORMAT(m.EndDate, 'yyyy-MM-dd')    AS EndDate
        ,ISNULL(m.promotionDays, '')        AS PromotionDays
        ,a.s3ObjectUrl        
	FROM Restaurant.Menu m WITH (NOLOCK)
    INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
      
    SELECT * FROM Restaurant.MenuType
    SELECT * FROM Dia    
END
GO