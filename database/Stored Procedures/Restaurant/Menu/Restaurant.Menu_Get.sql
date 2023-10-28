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
-- Restaurant.Menu_Get 139, '{"textSearch": "comb"}', ''
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Menu_Get @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @sql NVARCHAR(MAX)
            ,@params NVARCHAR(500)
            ,@textSearch VARCHAR(20)
            ,@forPromotion BIT
            ,@idEntidad INT
                        
    SET @params = N'@textSearch VARCHAR(20), @idEntidad INT'
    SELECT @textSearch = textSearch FROM OPENJSON(@json) WITH(textSearch VARCHAR(20) '$.textSearch')
    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId

    SET @sql = N' SELECT m.Id
                ,m.ProductId
                ,m.Title
                ,m.Summary
                ,m.MenuTypeId
                ,m.Content                
                ,a.s3ObjectUrl
                ,ISNULL(m.ForPromotion, CAST(0 AS BIT)) AS ForPromotion
	        FROM Restaurant.Menu m WITH (NOLOCK)
            INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
            WHERE a.idEntidad = @idEntidad '
   
     IF @textSearch IS NOT NULL
        BEGIN
            SET @sql = @sql + 'AND m.ForPromotion = 1 AND
                                (m.Title LIKE ''%''+@textSearch+''%''
                                OR m.Summary LIKE ''%''+@textSearch+''%''
                                OR m.Content LIKE ''%''+@textSearch+''%'') '
        END
        
    SET @tableNames = 'menus,menuTypes'

    EXEC sp_executesql @sql, @params, @textSearch, @idEntidad
    SELECT * FROM Restaurant.MenuType
END
GO