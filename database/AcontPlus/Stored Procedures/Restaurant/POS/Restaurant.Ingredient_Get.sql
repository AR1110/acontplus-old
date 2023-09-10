USE ACONTPLUS
GO
-- Author        : Ivan Paz - Ignacio Manchu.
-- Date          : 2023-08-04
-- Description   : SP FOR GET INGREDIENTS
-- Restaurant.Ingredient_Get 139, '{"pageIndex": 1,"pageSize": 10, "textSearch": "T", "tipo": 1}', ''
-- Restaurant.Ingredient_Get 139, '{"textSearch": "a", "tipo": 2}', ''
-- Restaurant.Ingredient_Get 139, '{"productId": 77484, "tipo": 3}', ''
CREATE OR ALTER PROCEDURE Restaurant.Ingredient_Get
@userRoleId INT,
@json VARCHAR(MAX),
@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @idEntidad      INT
            ,@tipo          INT
            ,@params        NVARCHAR(MAX)
            ,@sql           NVARCHAR(MAX)
            ,@pageIndex     INT
            ,@pageSize      INT
            ,@textSearch    VARCHAR(100)
            ,@productoId    INT
                       
    SELECT TOP 1  @idEntidad = idEntidad 
    FROM v_usuario WITH (NOLOCK) 
    WHERE idUsuarioRol = @userRoleId

    SELECT @pageIndex    = pageIndex
            ,@pageSize   = pageSize
            ,@textSearch = textSearch
            ,@tipo       = tipo
            ,@productoId = productId
    FROM OPENJSON(@json)
    WITH(pageIndex INT              '$.pageIndex'
         , pageSize INT             '$.pageSize'
         , textSearch VARCHAR(100)  '$.textSearch'
         , tipo INT                 '$.tipo'
         , productId INT            '$.productId'
    )

    --- GET
    IF @tipo = 1
        BEGIN
            SET @params = N'@idEntidad INT, @pageIndex INT, @pageSize INT'

            SET @sql = N'SELECT id          = ri.Id
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

    --- SEARCH -----
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'ingredients'
            SELECT ri.Id
                   , ri.Summary
                   , ri.ProductId AS productId
                   , va.descripcion as productDescription
            FROM Restaurant.Ingredient ri
            INNER JOIN Inventario.v_Articulo va ON va.idArticulo = ri.ProductId
            WHERE va.idEntidad = @idEntidad
            AND va.descripcion LIKE '%'+@textSearch+'%'
            OR ri.Summary LIKE '%'+@textSearch+'%'
            OR ri.Content LIKE '%'+@textSearch+'%'
        END

    --- GET MEDIDAS BY PRODUCTID
    IF @tipo = 3
        BEGIN
            SET @tableNames = 'extents'
            SELECT iv.idArticulo        AS idArticulo
                    ,idMedida           AS idMedida
                    , medida            AS descripcion
                    , precioCosto       AS precioCosto                    
            FROM Inventario.v_Articulo iv
            WHERE iv.idArticulo = @productoId
            AND iv.idEntidad = @idEntidad

            UNION
           
            SELECT vaf.idArticulo                   AS idArticulo
                    , vaf.idMedidaFraccionado       AS idMedida
                    , vaf.medidaFraccionada         AS descripcion
                    , vaf.precioCostoFraccionado    AS precioCosto
            FROM v_Articulo_Fraccionado vaf
            WHERE vaf.idArticulo = @productoId
            AND vaf.idEntidad = @idEntidad
        END
END