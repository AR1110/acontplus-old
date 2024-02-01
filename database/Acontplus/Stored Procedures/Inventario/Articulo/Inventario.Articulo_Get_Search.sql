USE AcontPlus
GO

/****** Object:  StoredProcedure [Almacen].[Articulo_Get_Search]    Script Date: 12/5/2022 1:57:57 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-10-11
-- Description:	<Description,,>
-- Test : EXEC [Almacen].[Articulo_Get_Search] 32 ,'[{"busqueda":"galle"}]'
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Articulo_Get_Search @idRol INT ,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    -->Globales 
    DECLARE @byEntidad INT

    -->Filter
	DECLARE @byFraccionado BIT ,@byArticulo INT ,@bySearch VARCHAR(500) ,@idBodega INT ,@codEstab_Asig VARCHAR(150)

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Recuperacion de informacion
	SELECT TOP 1 @byEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT TOP 1 @codEstab_Asig = codEstab_Asig FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1

	SELECT TOP 1 @idBodega = idBodega FROM Config.Bodeg_Asig WITH (NOLOCK) WHERE codEstab_Asig = @codEstab_Asig AND predeterminado = 1

	SELECT @bySearch      = REPLACE(busqueda, space(1), '%')
		  ,@byFraccionado = fraccionado
          ,@pageSize      = pageSize
	      ,@pageIndex     = pageIndex
	FROM OPENJSON(@json) WITH 
    (
	    busqueda    VARCHAR(500) 
	   ,fraccionado BIT
       ,pageIndex   INT 
	   ,pageSize    INT
    )

	--DECLARE @tblResult AS TABLE (
	--	idArticulo INT
	--	,codigo VARCHAR(100)
	--	,descripcion VARCHAR(300)
	--	,iva VARCHAR(10)
	--	,stock DECIMAL(15, 2)
	--	,stockMinimo DECIMAL(15, 2)
	--	,subFamilia VARCHAR(100)
	--	,marca VARCHAR(100)
	--	,medida VARCHAR(100)
	--	,porcentaje DECIMAL(4, 0)
	--	,fraccionado BIT NULL
	--	,s3ObjectUrl NVARCHAR(300) NULL
	--	,s3ObjectKey NVARCHAR(300) NULL
	--	)
	
    --> Search
    SET @params  = '@idEntidad  INT
				   ,@bySearch   VARCHAR(500)
				   ,@idBodega   INT
                   ,@pageSize   INT
				   ,@pageIndex  INT'

	SET @sql  = 'SELECT  a.idArticulo
			            ,IIF(a.porcentaje > 0, ''*'', '''') + a.codigo as codigo
			            ,a.descripcion
			            ,CAST(CAST(a.iva as decimal(15,0)) AS varchar)+ ''%'' as iva
			            ,a.stock
			            ,a.subFamilia
			            ,a.marca     
			            ,a.medida    
			            ,CASE WHEN a.fraccionado = 1 THEN ''badge badge-danger'' 
                                                    ELSE '''' 
                        END as fraccionado

			            ,CASE WHEN a.stock <= 0                            THEN ''badge badge-danger'' 
                            WHEN a.stock > 0 AND a.stock < a.stockMinimo THEN ''badge badge-warning'' 
                                                                            ELSE '''' 
                        END as style
			            ,(
				            SELECT t.descripcion  as tarifa
					                ,p.precioConIva as precio
				            FROM dbo.ArticuloPvP p WITH (NOLOCK)
				            INNER JOIN dbo.Tarifa t WITH (NOLOCK) ON t.idTarifa = p.idTarifa
				            WHERE p.idArticulo = a.idArticulo
				            ORDER BY t.codigo ASC
				            FOR JSON PATH

			            ) as priceSale
			            ,(
				            SELECT Helper.IsNullOrEmpty(au.ubicacion) as ubicacion
				            FROM dbo.ArticuloUbicacion au WITH (NOLOCK)
				            WHERE au.idArticulo = a.idArticulo
					            AND au.idBodega = @idBodega
				            FOR JSON PATH

			            ) as warehouses
			            ,0 as precioSinSubsidio
			            ,s3ObjectUrl
			            ,s3ObjectKey
                        ,COUNT(*) OVER() as totalRecords
	            FROM Inventario.v_Articulo a WITH (NOLOCK)
	            WHERE a.idEntidad = @idEntidad 
	            AND a.estado = 1
	            AND 
                ( 
		            a.descripcion    LIKE ''%''+@bySearch+''%'' OR
		            a.codigo         LIKE ''%''+@bySearch+''%'' OR
		            a.codigoAuxiliar LIKE ''%''+@bySearch+''%'' OR
		            a.codigoBarra    LIKE ''%''+@bySearch+''%'' 
	            ) '

	IF @byFraccionado = 1
		BEGIN
			SET @sql = @sql + 'AND a.productoFraccionable = 1 '
		END

    SET @sql = @sql + 'ORDER BY a.descripcion,a.codigo ASC OFFSET @pageSize * (@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

	----SET @sql = @sql + 'ORDER BY a.descripcion ASC'
	--INSERT INTO @tblResult (
	--	 idArticulo
	--	,codigo
	--	,descripcion
	--	,iva
	--	,stock
	--	,stockMinimo
	--	,subfamilia
	--	,marca
	--	,medida
	--	,porcentaje
	--	,fraccionado
	--	,s3ObjectUrl
	--	,s3ObjectKey
	--	)
	EXEC SP_EXECUTESQL @sql
		              ,@params
		              ,@idEntidad = @byEntidad
                      ,@bySearch  = @bySearch
                      ,@idBodega  = @idBodega
                      ,@pageIndex = @pageIndex
				      ,@pageSize  = @pageSize
                      
	--	,@busqueda = @bySearch

	--IF EXISTS (SELECT 1 FROM @tblResult)
	--    BEGIN
	--	    SELECT a.idArticulo
	--		      ,IIF(a.porcentaje > 0, '*', '') + a.codigo as codigo
	--		      ,a.descripcion
	--		      ,CAST(CAST(a.iva as decimal(15,0)) AS varchar)+'%' as iva
	--		      ,a.stock
	--		      ,a.stockMinimo
	--		      ,ISNULL(a.subfamilia, 'N/A') as subFamilia
	--		      ,ISNULL(a.marca, 'N/A')      as marca
	--		      ,ISNULL(a.medida, 'N/A')     as medida
	--		      ,CASE WHEN a.fraccionado = 1 THEN 'badge badge-danger' 
 --                                              ELSE '' 
 --                  END as fraccionado

	--		      ,CASE WHEN a.stock <= 0                            THEN 'badge badge-danger' 
 --                       WHEN a.stock > 0 AND a.stock < a.stockMinimo THEN 'badge badge-warning' 
 --                                                                    ELSE '' 
 --                  END as style
	--		      ,(
	--			        SELECT t.descripcion  as tarifa
	--				          ,p.precioConIva as precio
	--			        FROM dbo.ArticuloPvP p WITH (NOLOCK)
	--			        INNER JOIN dbo.Tarifa t WITH (NOLOCK) ON t.idTarifa = p.idTarifa
	--			        WHERE p.idArticulo = a.idArticulo
	--			        ORDER BY t.codigo ASC
	--			        FOR JSON PATH

	--		       ) as priceSale
	--		      ,(
	--			        SELECT Helper.IsNullOrEmpty(au.ubicacion) as ubicacion
	--			        FROM dbo.ArticuloUbicacion au WITH (NOLOCK)
	--			        WHERE au.idArticulo = a.idArticulo
	--				        AND au.idBodega = @idBodega
	--			        FOR JSON PATH

	--		       ) as warehouses
	--		      ,0 as precioSinSubsidio
	--		      ,s3ObjectUrl
	--		      ,s3ObjectKey
	--	    FROM @tblResult a
	--    END
END
