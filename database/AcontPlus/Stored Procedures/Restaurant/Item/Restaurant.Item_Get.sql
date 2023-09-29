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
-- Restaurant.Item_Get 139, '{"tipo":2,"idSubFamilia":0,"pageIndex":1,"pageSize":25}', ''
IF OBJECT_ID(N'Restaurant.Item_Get', N'P') IS NOT NULL
	DROP PROCEDURE Restaurant.Item_Get
GO
CREATE PROCEDURE Restaurant.Item_Get
@userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @pageIndex INT
	,@pageSize INT	
	,@idSubFamilia INT
	,@idFamilia INT
	,@checkSubFamilia BIT
	,@sql NVARCHAR(MAX)
	,@idEntidad INT
	,@params NVARCHAR(MAX)
    ,@tipo INT    
    ,@textSearch VARCHAR(20)
    ,@dateNow DATETIME = (SELECT dbo.ufnGetDateEcuador())
    ,@day VARCHAR(12)
    ,@hour VARCHAR(5)
    			
	SELECT @idSubFamilia  = idSubFamilia
		  ,@idSubFamilia  = idFamilia
		  ,@pageIndex	  = pageIndex
		  ,@pageSize	  = pageSize
          ,@tipo          = tipo            
          ,@textSearch    = textSearch
	FROM OPENJSON(@json) 
	WITH(
         tipo               INT         '$.tipo'
		,idSubFamilia	    INT         '$.idSubFamilia'
		,idFamilia	        INT         '$.idSubFamilia'
		,pageIndex		    INT         '$.pageIndex'
		,pageSize		    INT         '$.pageSize'       
        ,textSearch         VARCHAR(20) '$.textSearch'
	)

	SELECT TOP 1  @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SET @day    = (SELECT DATENAME(weekday, GETDATE()))
    SET @hour   = (SELECT FORMAT(GETDATE(), 'HH:mm'))

    PRINT @day
    PRINT @hour

	SET @params = N'@idEntidad INT, @idSubFamilia INT, @pageIndex INT, @pageSize INT, @textSearch VARCHAR(20)'

	SET @sql = N'  SELECT Id			            = ri.Id
				    ,summary			            = ISNULL(ri.Summary, '''')
				    ,cooking			            = ri.Cooking
				    ,recipe				            = ri.Recipe
				    ,instructions		            = ISNULL(ri.Instructions, '''')
                    ,content                        = ISNULL(ri.content, '''')
				    ,createdAt			            = ri.CreatedAt
				    ,updatedAt			            = ri.UpdatedAt
				    ,enabled			            = ri.Enabled
				    ,deleted			            = ri.Deleted
				    ,userId				            = ri.UserId
				    ,productId			            = ri.ProductId
				    ,descripcion		            = a.descripcion
				    ,s3ObjectUrl		            = a.s3ObjectUrl
				    ,stockMinimo		            = a.stockMinimo
				    ,stock				            = a.stock
				    ,codigo				            = a.codigo
                    ,medida                         = a.medida
				    ,codigoAuxiliar		            = a.codigoAuxiliar
				    ,tipoIva			            = CAST(CAST(a.porcentaje AS DECIMAL(15,0)) AS VARCHAR)+''%''
				    ,tipoArticulo		            = ISNULL(a.tipoArticulo,''Ninguna'')
				    ,style				            = a.colorRow
				    ,ProductionAreaId               = pa.Id
				    ,descripcionProductionArea      = pa.Description
                    ,costPrice                      = a.precioCosto
                    ,pvp				            = (SELECT	idArticuloPvP = ap.idArticuloPvP
										                        ,idTarifa = ap.idTarifa
										                        ,precioVenta = ap.precioVenta
										                        ,precioConIva = ap.precioConIva
										                        ,porcentajeUtilidad = ap.porcentajeUtilidad
										                        ,precioPredeterminado = ta.predeterminada
										                        ,tarifa = ta.descripcion
										                        ,porcentajeIva = ti.porcentaje
								                        FROM ArticuloPvP ap
								                        INNER JOIN Tarifa ta ON ta.idTarifa = ap.idTarifa								
								                        LEFT JOIN TipoIva ti ON ti.idTipoIva = a.idTipoIva
								                        WHERE ap.idArticulo = a.idArticulo AND ta.predeterminada = 1
								                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                    ,codTipoArticulo                = ISNULL(a.codTipoArticulo, '''')
                    ,totalRecords                   = COUNT(*) over()
                    ,itemTypeCode                   = ''ITEM''
                    ,a.idMedida                        
			FROM Restaurant.Item ri
			INNER JOIN Inventario.v_Articulo a ON a.idArticulo = ri.ProductId
			LEFT JOIN Restaurant.ProductionArea pa ON pa.Id = ri.ProductionAreaId
			WHERE a.idEntidad = @idEntidad '
    
    -- ===== PARTE ADMINISTRATIVA ===== --
    IF @tipo = 1
        BEGIN
            IF @textSearch IS NOT NULL
                BEGIN
                    SET @sql = @sql + ' AND a.descripcion LIKE ''%''+@textSearch+''%'' 
                                        OR ri.Summary LIKE ''%''+@textSearch+''%'' 
                                        OR ri.Content LIKE ''%''+@textSearch+''%'' '
                END
                
	        SET @sql = @sql + ' ORDER BY ri.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'
		           
	        SET @tableNames = 'items'
	        EXEC sp_executesql @sql 
                                , @params
                                , @idEntidad
                                , @idSubFamilia
                                , @pageIndex
                                , @pageSize
                                , @textSearch
        END

    -- ===== PARTE RESTAURANT POS ===== --
    IF @tipo = 2
        BEGIN
            IF @idSubFamilia > 0
		        BEGIN			
			        SET @sql = @sql + ' AND a.idSubFamilia = @idSubFamilia '
		        END
            ELSE
                BEGIN
                    SET @sql = @sql + ' AND a.siglaSubFamilia NOT IN(''COM'') '
                END

            SET @sql = @sql + ' ORDER BY ri.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'

            SET @tableNames = 'items'
	        EXEC sp_executesql @sql 
                                , @params
                                , @idEntidad
                                , @idSubFamilia
                                , @pageIndex
                                , @pageSize
                                , @textSearch
        END

    -- ===== par ===== --
    -----Listado de Menus ----
    IF (@tipo = 3) 
         BEGIN
            SET @tableNames = 'items'
            SELECT m.*
                ,s3ObjectUrl		= a.s3ObjectUrl
				,stock				= a.stock
				,codigo				= a.codigo
                ,summary            = m.Summary
                ,descripcion		= a.descripcion
                ,pvp				= (SELECT idArticuloPvP = ap.idArticuloPvP
										       ,idTarifa = ap.idTarifa
										       ,precioVenta = ap.precioVenta
										       ,precioConIva = ap.precioConIva
										       ,porcentajeUtilidad = ap.porcentajeUtilidad
										       ,precioPredeterminado = ta.predeterminada
										       ,tarifa = ta.descripcion
										       ,porcentajeIva = ti.porcentaje
								        FROM ArticuloPvP ap
								        INNER JOIN Tarifa ta ON ta.idTarifa = ap.idTarifa								
								        LEFT JOIN TipoIva ti ON ti.idTipoIva = a.idTipoIva
								        WHERE ap.idArticulo = a.idArticulo AND ta.predeterminada = 1
								        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
               ,totalRecords       = COUNT(*) OVER()
               ,itemTypeCode = 'MENU'
            FROM Restaurant.Menu m WITH(NOLOCK)
            INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
            WHERE a.idEntidad = @idEntidad AND a.siglaFamilia = 'COM'
            AND ISNULL(m.ForPromotion, 0) = 0 
            ORDER BY m.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
         END
END
GO