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
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Menu_Get @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    
    SET @tableNames = 'menus,menuTypes'
	SELECT m.*
        ,a.s3ObjectUrl
	FROM Restaurant.Menu m WITH (NOLOCK)
    INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
      
    SELECT * FROM Restaurant.MenuType
    
END
GO
