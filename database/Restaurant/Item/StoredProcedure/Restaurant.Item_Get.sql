USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Item_Get]    Script Date: 6/10/2025 18:01:16 ******/
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
-- Restaurant.Item_Get 847, '{"tipo":1,"pageIndex":1,"pageSize":25,"idSubFamilia":null,"textSearch":"COSTI"}', ''

CREATE OR ALTER   PROCEDURE [Restaurant].[Item_Get]
    @userRoleId INT
   ,@json NVARCHAR(MAX)
   ,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Variables Globales
    DECLARE @idEntidad INT ,@tipo INT ,@textSearch VARCHAR(20) ,@pageIndex INT ,@pageSize INT

    --> Data json
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT )

    --> 
    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> GET 
    IF @tipo = 1
        BEGIN
            SET @tableNames = 'items'

            DECLARE @idSubFamilia INT
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
                              ,ISNULL(a.codTipoArticulo, '''')  AS codTipoArticulo
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
            SET @sql = @sql + ' AND a.siglaFamilia NOT IN(''COM'') '
        END

        IF @textSearch IS NOT NULL
                BEGIN
            SET @sql = @sql + ' AND (a.descripcion LIKE ''%''+@textSearch+''%''
                                        OR ri.Summary LIKE ''%''+@textSearch+''%''
                                        OR ri.Content LIKE ''%''+@textSearch+''%'') '
        END

            SET @sql = @sql + ' ORDER BY ri.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'

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

            DECLARE @siglaFamilia VARCHAR(20)

            SELECT @textSearch = textSearch ,@siglaFamilia = siglaFamilia FROM OPENJSON(@json) WITH (textSearch VARCHAR(20), siglaFamilia VARCHAR(20))

            SELECT idArticulo as productId
                  ,descripcion
	              ,codigo
	              ,subFamilia
            FROM Inventario.v_Articulo ar
            WHERE siglaFamilia = @siglaFamilia
              AND idEntidad = @idEntidad
              AND
              (
                   descripcion LIKE '%'+@textSearch+'%'
                OR codigo      LIKE '%'+@textSearch+'%'
              )
            RETURN 
              
        END

    -->
    IF @tipo = 3
         BEGIN
            SET @tableNames = 'items'

            SELECT @pageSize = pageSize ,@pageIndex = pageIndex FROM OPENJSON(@json)WITH (pageSize INT ,pageIndex INT)

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
            SET @tableNames = 'menu,components'

            DECLARE @ProductId INT

            DECLARE @uniquedId VARCHAR(100) = NEWID()

            SELECT @ProductId = productId FROM OPENJSON(@json) WITH (productId INT)

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
                  ,ISNULL
                   ((
                        SELECT me.idMedida
                              ,me.descripcion            as medida
                              ,ar.precioCosto
                              ,af.precioCostoFraccionado as precioUnitario
                              ,af.precioCostoFraccionado as precioCostoFraccionado
                              ,af.conversion
                        FROM ArticuloFraccionado af WITH (NOLOCK) 
                        INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
                        INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida 
                        WHERE af.idArticulo = a.idArticulo 
                        FOR JSON PATH

                   ),'[]') as fraccionado 

                  ,ISNULL
                   ((
                        SELECT me.idMedida 
                              ,me.descripcion  as medida
                              ,ar.precioCosto 
                              ,ar.precioCosto  as precioUnitario
                              ,ar.precioCosto  as precioCostoFraccionado
                              ,1               as conversion
                        FROM Articulo     ar WITH (NOLOCK) 
                        INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = ar.idMedida 
                        WHERE ar.idArticulo = a.idArticulo 
                        FOR JSON PATH

                    ),'[]') as principal
                    ,@uniquedId as uniqueId
			FROM Inventario.v_Articulo a 
			WHERE a.idArticulo = @productId
			AND a.llevaInventario = 1

            IF EXISTS (SELECT 1 FROM Restaurant.Item WHERE productId = @productId)
                BEGIN
                    DECLARE @itemId INT

                    SELECT TOP 1 @itemId = id FROM Restaurant.Item WHERE productId = @productId

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
                          ,re.Quantity as conversion
                          ,ISNULL
                           ((
                                SELECT me.idMedida
                                      ,me.descripcion            as medida
                                      ,ar.precioCosto
                                      ,af.precioCostoFraccionado as precioUnitario
                                      ,af.precioCostoFraccionado as precioCostoFraccionado
                                      ,af.conversion
                                FROM ArticuloFraccionado af WITH (NOLOCK) 
                                INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida 
                                WHERE af.idArticulo = ar.idArticulo 
                                FOR JSON PATH

                           ),'[]') as fraccionado 

                          ,ISNULL
                           ((
                                SELECT me.idMedida 
                                      ,me.descripcion  as medida
                                      ,sa.precioCosto 
                                      ,sa.precioCosto  as precioUnitario
                                      ,sa.precioCosto  as precioCostoFraccionado
                                      ,1               as conversion
                                FROM Articulo     sa WITH (NOLOCK) 
                                INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = sa.idMedida 
                                WHERE sa.idArticulo = ar.idArticulo 
                                FOR JSON PATH

                            ),'[]') as principal
                            ,@uniquedId as uniqueId
			        FROM Restaurant.Recipe           re
                    INNER JOIN Restaurant.Ingredient ig ON ig.Id         = re.IngredientId 
			        INNER JOIN Inventario.v_Articulo ar on ar.idArticulo = ig.ProductId 
			        WHERE re.[Enabled] = 1
			          AND re.ItemId = @itemId
                      AND re.Deleted IS NULL
			          AND ar.llevaInventario = 1
                END

            IF EXISTS (SELECT 1 FROM Restaurant.Menu WHERE productId = @productId)
                BEGIN
                    DECLARE @MenuId INT

                    SELECT TOP 1 @MenuId = id FROM Restaurant.Menu WHERE productId = @productId

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
                          ,ISNULL
                           ((
                                SELECT me.idMedida
                                      ,me.descripcion            as medida
                                      ,ar.precioCosto
                                      ,af.precioCostoFraccionado as precioUnitario
                                      ,af.precioCostoFraccionado as precioCostoFraccionado
                                      ,af.conversion
                                FROM ArticuloFraccionado af WITH (NOLOCK) 
                                INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida 
                                WHERE af.idArticulo = ar.idArticulo 
                                FOR JSON PATH

                           ),'[]') as fraccionado 

                          ,ISNULL
                           ((
                                SELECT me.idMedida 
                                      ,me.descripcion  as medida
                                      ,sa.precioCosto 
                                      ,sa.precioCosto  as precioUnitario
                                      ,sa.precioCosto  as precioCostoFraccionado
                                      ,1               as conversion
                                FROM Articulo     sa WITH (NOLOCK) 
                                INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = sa.idMedida 
                                WHERE sa.idArticulo = ar.idArticulo 
                                FOR JSON PATH

                            ),'[]') as principal
                            ,@uniquedId as uniqueId
			        FROM Restaurant.MenuItem         mi
			        INNER JOIN Restaurant.Item       it ON it.id         = mi.ItemId 
			        INNER JOIN Inventario.v_Articulo ar on ar.idArticulo = it.ProductId 
			        WHERE mi.[Enabled] = 1
			          AND mi.MenuId = @MenuId
                      AND mi.Deleted IS NULL
			          AND ar.llevaInventario = 1
                END
            RETURN
        END 
END
