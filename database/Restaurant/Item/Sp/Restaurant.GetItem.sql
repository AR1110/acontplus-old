USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[GetItem]    Script Date: 7/11/2025 11:08:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2023-08-14
-- Description:	Get Item
CREATE OR ALTER PROCEDURE Restaurant.GetItem
    @UserRoleId INT
   ,@Json NVARCHAR(MAX)
   ,@TableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Variables Globales
    DECLARE @idEntidad INT ,@tipo INT ,@textSearch VARCHAR(20) ,@pageIndex INT ,@pageSize INT ,@sigla VARCHAR(50) ,@siglaFormatted VARCHAR(500)

    --> Data json
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT )

    --> 
    SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> GET 
    IF @tipo = 1
        BEGIN
            SET @tableNames = 'items'

            DECLARE @idSubFamilia INT
	               ,@sql NVARCHAR(MAX)
	               ,@params NVARCHAR(MAX)

            SELECT @idSubFamilia  = idSubFamilia
		          ,@pageIndex	  = pageIndex
		          ,@pageSize	  = pageSize
                  ,@textSearch    = textSearch
                  ,@sigla         = sigla
            FROM OPENJSON(@json)WITH
            (
                 idSubFamilia INT         '$.idSubFamilia'
		        ,pageIndex	  INT         '$.pageIndex'
		        ,pageSize	  INT         '$.pageSize'
                ,textSearch   VARCHAR(50) '$.textSearch'
                ,sigla        VARCHAR(50) 
	        )

            SET @params = '@idEntidad    INT
                          ,@idSubFamilia INT
                          ,@pageIndex    INT
                          ,@pageSize     INT
                          ,@textSearch   VARCHAR(50)'

            SET @sql = 'WITH cte_item AS
                        (
                            SELECT ri.Id                                  
                                  ,ri.ProductId
                                  ,ISNULL(ri.title, '''')   as title
                                  ,ISNULL(ri.Summary, '''') as summary
                                  ,ar.s3ObjectUrl           as s3ObjectUrl
                                  ,ar.descripcion           as description
                                  ,ar.codigo                as code                 
                                  ,ar.medida                as measure                              
                                  ,ar.codigoAuxiliar        as auxiliary_code            
                                  ,ar.precioCosto           as costPrice
                                  ,ar.categoria             as category
                            FROM Restaurant.Item             ri
                            INNER JOIN Inventario.v_Articulo ar ON ar.idArticulo = ri.ProductId
                            WHERE ar.estado = 1
                              AND ar.idEntidad = @idEntidad '

            IF @textSearch IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND
                                       (
                                               ar.descripcion LIKE ''%''+@textSearch+''%''
                                            OR ri.Summary     LIKE ''%''+@textSearch+''%''
                                            OR ri.Content     LIKE ''%''+@textSearch+''%''
                                       ) '
                END

            IF @idSubFamilia > 0
		        BEGIN
                    SET @sql = @sql + 'AND ar.idSubFamilia = @idSubFamilia '
                END
            ELSE
                BEGIN
                    IF @sigla IS NOT NULL
                        BEGIN
                            SET @siglaFormatted = '''' + REPLACE(@sigla, ',', ''',''') + ''''

                            SET @sql = @sql + 'AND ar.siglaFamilia IN (' + @siglaFormatted + ') '
                        END
                    ELSE
                        BEGIN 
                            SET @sql = @sql + 'AND ar.siglaFamilia NOT IN (''COM'') '
                        END 
                END

            SET @sql = @sql + ') SELECT *, COUNT(*) OVER() as total_records FROM cte_item ORDER BY Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'

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

                         + N')

                     SELECT * INTO #FilteredItems FROM FilteredItems OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredItems;

                     SELECT * FROM #FilteredItems ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems ' ;


        EXEC sp_executesql
            @DataSQL
           ,@Params
           ,@idEntidad
           ,@idSubFamilia
           ,@sigla
           ,@SearchTerm
           ,@Offset
           ,@PageSize
           ,@TotalCount = @TotalCount OUTPUT
    END TRY

    BEGIN CATCH
        --> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.GetItem'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/item/Get'

        SELECT @ErrorDetails = (
            SELECT @UserRoleId          AS UserRoleId
                  ,@PageIndex           AS PageIndex
                  ,@PageSize            AS PageSize
                  ,@SortBy              AS SortBy
                  ,@SortDirection       AS SortDirection
                  ,@SearchTerm          AS SearchTerm
                  ,JSON_QUERY(@Filters) AS Filters 
                  ,@Offset              AS Offset
            FOR JSON PATH
        );
 
        --> Limpiar tabla temporal en caso de error
        IF OBJECT_ID('tempdb..#FilteredItems') IS NOT NULL DROP TABLE #FilteredItems;

        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;
    END CATCH 
END
