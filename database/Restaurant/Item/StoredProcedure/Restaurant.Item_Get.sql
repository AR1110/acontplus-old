USE AcontPlus
GO
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2023-08-14
-- Description:	Get Item
-- =============================================
-- Restaurant.Item_Get 139, '{"idSubFamilia":0,"pageIndex":1,"pageSize":100,"tipo":1}', ''
-- Restaurant.Item_Get 139, '{"tipo":2}', ''
-- Restaurant.Item_Get 139, '{"tipo":4, "pageIndex":1,"pageSize":10 }', ''
-- Restaurant.Item_Get 362, '{"tipo":2,"pageIndex":1,"pageSize":25,"idSubFamilia":null,"textSearch":"MATCHA FRIO MIKUNA"}', ''

CREATE OR ALTER PROCEDURE Restaurant.Item_Get
    @userRoleId INT
   ,@json NVARCHAR(MAX)
   ,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Variables Globales
    DECLARE @idEntidad INT ,@tipo INT ,@textSearch VARCHAR(20)

    --> Data json
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT )

    --> 
    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> GET 
    IF @tipo = 1
        BEGIN
            SET @tableNames = 'items'

            DECLARE @pageIndex INT
	               ,@pageSize INT
	               ,@idSubFamilia INT
	               ,@sql NVARCHAR(MAX)
	               ,@params NVARCHAR(MAX)

            SELECT @idSubFamilia  = idSubFamilia
		          ,@idSubFamilia  = idFamilia
		          ,@pageIndex	  = pageIndex
		          ,@pageSize	  = pageSize
                  ,@textSearch    = textSearch
            FROM OPENJSON(@json)
	        WITH
            (
                 idSubFamilia INT         '$.idSubFamilia'
		        ,idFamilia	  INT         '$.idSubFamilia'
		        ,pageIndex	  INT         '$.pageIndex'
		        ,pageSize	  INT         '$.pageSize'
                ,textSearch   VARCHAR(20) '$.textSearch'
	        )

            SET @params = '@idEntidad INT, @idSubFamilia INT, @pageIndex INT, @pageSize INT, @textSearch VARCHAR(20)'

            SET @sql = 'SELECT ri.Id                                                      AS Id
                              ,ISNULL(ri.Summary, '''')                                   AS summary
                              ,ri.Cooking                                                 AS cooking
                              ,ri.Recipe                                                  AS recipe
                              ,ISNULL(ri.Instructions, '''')                              AS instructions
                              ,ISNULL(ri.content, '''')                                   AS content
                              ,ri.CreatedAt                                               AS createdAt
                              ,ri.UpdatedAt                                               AS updatedAt
                              ,ri.Enabled                                                 AS enabled
                              ,ri.Deleted                                                 AS deleted
                              ,ri.UserId                                                  AS userId
                              ,ri.ProductId                                               AS productId
                              ,a.descripcion                                              AS descripcion
                              ,a.s3ObjectUrl                                              AS s3ObjectUrl
                              ,a.stockMinimo                                              AS stockMinimo
                              ,ISNULL(a.stock, 0)                                         AS stock
                              ,a.codigo                                                   AS codigo
                              ,a.medida                                                   AS medida
                              ,a.codigoAuxiliar                                           AS codigoAuxiliar
                              ,CAST(CAST(a.porcentaje AS DECIMAL(15,0)) AS VARCHAR)+''%'' AS tipoIva
                              ,ISNULL(a.tipoArticulo,''Ninguna'') AS tipoArticulo
                              ,a.colorRow                                                 AS style
                              ,a.precioCosto                                              AS costPrice
                              ,(
                                    SELECT ap.idArticuloPvP         AS idArticuloPvP
                                          ,ap.idTarifa              AS idTarifa
                                          ,ap.precioVenta           AS precioVenta
                                          ,ap.precioConIva          AS precioConIva
                                          ,ap.porcentajeUtilidad    AS porcentajeUtilidad
                                          ,ta.predeterminada        AS precioPredeterminado
                                          ,ta.descripcion           AS tarifa
                                          ,ti.porcentaje            AS porcentajeIva
                                    FROM ArticuloPvP ap
                                    INNER JOIN Tarifa  ta ON ta.idTarifa  = ap.idTarifa
                                     LEFT JOIN TipoIva ti ON ti.idTipoIva = a.idTipoIva
                                    WHERE ap.idArticulo = a.idArticulo
                                      AND ta.predeterminada = 1
                                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER

                               )                                AS pvp
                              ,ISNULL(a.codTipoArticulo,'''')   AS codTipoArticulo
                              ,COUNT(*) over()                  AS totalRecords
                              ,''ITEM''                         AS itemTypeCode
                              ,a.idMedida                       AS idMedida
                              ,a.siglaFamilia                   AS siglaFamilia
                              ,a.categoria                    
                        FROM Restaurant.Item            ri
                        INNER JOIN Inventario.v_Articulo a ON a.idArticulo = ri.ProductId
                        WHERE a.estado = 1
                          AND a.idEntidad = @idEntidad '

            IF @textSearch IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND
                                       (
                                            a.descripcion LIKE ''%''+@textSearch+''%''
                                            OR ri.Summary LIKE ''%''+@textSearch+''%''
                                            OR ri.Content LIKE ''%''+@textSearch+''%''
                                       ) '
                END

            IF @idSubFamilia > 0
		        BEGIN
                    SET @sql = @sql + 'AND a.idSubFamilia = @idSubFamilia '
                END
            ELSE
                BEGIN
                    SET @sql = @sql + 'AND a.siglaFamilia NOT IN(''COM'') '
                END  

            SET @sql = @sql + 'ORDER BY ri.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
                              ,@params
                              ,@idEntidad
                              ,@idSubFamilia
                              ,@pageIndex
                              ,@pageSize
                              ,@textSearch

        RETURN
    END

    --> Search de menus y combos
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'items'

            SELECT ar.idArticulo
                  ,ar.codigo
                  ,ar.stock
                  ,me.Id as MenuId
                  ,me.Summary
                  ,me.Content
            FROM Restaurant.Menu    me
            INNER JOIN dbo.Articulo ar ON ar.idArticulo = me.ProductId
            WHERE ar.idEntidad = @idEntidad
              AND ar.estado = 1
              AND
              (
                   ar.descripcion LIKE '%'+@textSearch+'%'
                OR ar.codigo      LIKE '%'+@textSearch+'%'
                OR me.Summary     LIKE '%'+@textSearch+'%'
                OR me.Content     LIKE '%'+@textSearch+'%'
              )
            RETURN 
        END

    -->
    IF @tipo = 3
         BEGIN
            SET @tableNames = 'items'
            SELECT m.*
                    , s3ObjectUrl		= a.s3ObjectUrl
				    , stock				= a.stock
				    , codigo				= a.codigo
                    , summary            = m.Summary
                    , descripcion		= a.descripcion
                    , pvp				= (SELECT idArticuloPvP = ap.idArticuloPvP
										           , idTarifa = ap.idTarifa
										           , precioVenta = ap.precioVenta
										           , precioConIva = ap.precioConIva
										           , porcentajeUtilidad = ap.porcentajeUtilidad
										           , precioPredeterminado = ta.predeterminada
										           , tarifa = ta.descripcion
										           , porcentajeIva = ti.porcentaje
                FROM ArticuloPvP ap
                    INNER JOIN Tarifa ta ON ta.idTarifa = ap.idTarifa
                    LEFT JOIN TipoIva ti ON ti.idTipoIva = a.idTipoIva
                WHERE ap.idArticulo = a.idArticulo AND ta.predeterminada = 1
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                   , totalRecords       = COUNT(*) OVER()
                   , itemTypeCode = 'MENU'
            FROM Restaurant.Menu m WITH(NOLOCK)
                INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
            WHERE a.idEntidad = @idEntidad AND a.estado = 1 AND a.siglaFamilia = 'COM'
                AND ISNULL(m.ForPromotion, 0) = 0
            ORDER BY m.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
            RETURN
        END


    --> Get id para la carga en orden de produccion
    IF @tipo = 4
        BEGIN
            DECLARE @MenuId INT

            SELECT @MenuId = MenuId FROM OPENJSON(@json) WITH (MenuId INT)

            SET @tableNames = 'menu,components'

            SELECT a.idArticulo
				  ,a.codigo
				  ,a.codigoAuxiliar
				  ,a.codigoBarra
				  ,a.descripcion
				  ,a.stock
				  ,a.precioCosto
				  ,a.estado
				  ,a.iva
				  ,llevaInventario
				  ,a.idMedida
				  ,a.medida
			FROM Restaurant.Menu me  
			INNER JOIN Inventario.v_Articulo a on a.idArticulo = me.ProductId 
			WHERE me.[Enabled] = 1
			AND me.Id = @MenuId
			AND a.llevaInventario = 1

            SELECT ar.idArticulo
				  ,ar.codigo
				  ,ar.codigoAuxiliar
				  ,ar.codigoBarra
				  ,ar.descripcion
				  ,ar.stock
				  ,ar.precioCosto
				  ,ar.estado
				  ,ar.iva
				  ,ar.llevaInventario
				  ,ar.idMedida
				  ,ar.medida
                  ,mi.Quantity as conversion
			FROM Restaurant.MenuItem         mi
			INNER JOIN Restaurant.Item       it ON it.id         = mi.ItemId 
			INNER JOIN Inventario.v_Articulo ar on ar.idArticulo = it.ProductId 
			WHERE mi.[Enabled] = 1
			  AND mi.Id = @MenuId
			  AND ar.llevaInventario = 1

            RETURN
        END 
END
GO
