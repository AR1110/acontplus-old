USE ACONTPLUS
GO

--Author: Ivan Paz - Ignacio Manchu.
--Date: 2023-08-04
--Description: SP FOR GET INGREDIENTS
-- Restaurant.Ingredient_Get 139, '{"pageIndex": 1,"pageSize": 10}', ''
CREATE OR ALTER PROCEDURE Restaurant.Ingredient_Get
    @userRoleId INT,
    @json VARCHAR(MAX),
    @tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @idEntidad INT
            ,@params   NVARCHAR(MAX)
            ,@sql      NVARCHAR(MAX)
            ,@pageIndex INT
            ,@pageSize  INT
                        
    SET @params = N'@idEntidad INT, @pageIndex INT, @pageSize INT'

    SELECT TOP 1  @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @pageIndex = pageIndex
            ,@pageSize = pageSize
    FROM OPENJSON(@json)
    WITH(
        pageIndex    INT '$.pageIndex'
        ,pageSize    INT '$.pageSize'        
    )
    
    SET @sql = N'SELECT id                  = ri.Id
                       ,summary             = ISNULL(ri.Summary, '''')
                       ,quantity            = ISNULL(ri.quantity, 0)
                       ,unit                = ISNULL(ri.unit, 0)
                       ,content             = ISNULL(ri.content, '''')          
                       ,productDescription  = va.descripcion
                       ,s3ObjectUrl         = ISNULL(va.s3ObjectUrl, '''')
                       ,ingredientTypeId    = ri.IngredientTypeId
                       ,productId           = ri.ProductId
                       ,totalRecords        = COUNT(*) OVER()
                FROM Restaurant.Ingredient ri
                INNER JOIN Inventario.v_Articulo va ON va.idArticulo = ri.ProductId
                WHERE va.idEntidad = @idEntidad '

    SET @sql = @sql + ' ORDER BY ri.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'

    SET @tableNames = 'ingredients'
    EXEC sp_executesql @sql 
                        , @params
                        , @idEntidad
                        , @pageIndex
                        , @pageSize
    
END