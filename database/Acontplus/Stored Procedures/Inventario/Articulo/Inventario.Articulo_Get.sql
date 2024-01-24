USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Get]    Script Date: 12/14/2022 8:56:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-25
-- Description:	SP Para leer los datos e la tabla articulo
-- =============================================
--- Inventario.Articulo_Get 28 '{"idArticulo":76408,"idBodega":2,"tipo":6}'
CREATE OR ALTER PROCEDURE Inventario.Articulo_Get @idRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    --> Global
	DECLARE @tipo INT ,@idEntidad INT ,@pageIndex INT ,@pageSize INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX)

	--> Filters
	DECLARE @idSubFamilia INT ,@idMedida  INT ,@idMarca INT ,@idModelo INT
	       ,@checkBoxFraccionado BIT ,@idTipoIva INT ,@estado BIT ,@byStock INT ,@checkBoxInventario  BIT 
	       ,@idArticulo INT ,@idBodega INT ,@bySearch NVARCHAR(300) ,@byColumn VARCHAR(10)

    --> Inventario 
	DECLARE @ventaStockMinimo BIT ,@stockCantidad BIT ,@ventaStockCero BIT ,@stock NUMERIC(18,5) ,@stockMinimo NUMERIC(18,5) ,@cantidad NUMERIC(18,5)

    --> Recuperando Datos
	SELECT TOP 1  @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)
	
	--> Get
	IF @tipo = 1
		BEGIN
			
			SELECT @bySearch            = REPLACE(bySearch,SPACE(1),'%')
				  ,@idSubFamilia        = bySubFamilia
				  ,@idMedida            = byMedida
				  ,@idMarca             = byMarca
				  ,@idModelo            = byModelo
				  ,@idTipoIva           = byTipoIva
				  ,@estado              = estado
				  ,@byStock             = byStock
				  ,@checkBoxFraccionado = checkBoxFraccionado
				  ,@checkBoxInventario  = checkBoxInventario
				  ,@pageIndex           = pageIndex
				  ,@pageSize            = pageSize
			FROM OPENJSON(@json) WITH 
			(   bySearch   VARCHAR(500) '$.bySearch'
			   ,bySubFamilia        INT '$.bySubFamilia'
			   ,byMedida            INT '$.byMedida'
			   ,byMarca             INT '$.byMarca'
			   ,byModelo            INT '$.byModelo'
			   ,byTipoIva	        INT '$.byTipoIva'
			   ,estado	            BIT '$.status'
			   ,byStock	            INT '$.byStock'
			   ,checkBoxFraccionado BIT '$.checkBoxFraccionado'
			   ,checkBoxInventario  BIT '$.checkBoxInventario'
			   ,pageIndex			INT '$.pageIndex'
			   ,pageSize            INT '$.pageSize'
			)

			SET @params  = '@idEntidad INT
						   ,@bySearch VARCHAR(250)
						   ,@idSubFamilia INT
						   ,@idMedida INT
						   ,@idMarca INT
						   ,@idModelo INT
						   ,@idTipoIva INT
						   ,@estado BIT
						   ,@pageIndex INT
						   ,@pageSize INT '

			SET @sql  = 'SELECT a.idArticulo
							   ,a.idMedida
							   ,a.code_unique
							   ,codigo        = ISNULL(a.codigo,''Ninguno'')
							   ,descripcion   = ISNULL(a.descripcion, ''Ninguno'')
							   ,precioCosto   
							   ,estado       
							   ,stock        
							   ,observaciones 
							   ,subFamilia    
							   ,medida        
							   ,marca        
							   ,modelo       
							   ,tipoIva           = CAST(CAST(a.porcentaje as decimal(15,0)) AS VARCHAR)+''%''
							   ,tipoArticulo      = ISNULL(a.tipoArticulo,''Ninguna'')
							   ,style             = a.colorRow 
							   ,precioSinSubsidio = ISNULL(precioSinSubsidio, 0)
							   ,a.stockMinimo
							   ,totalRecords = COUNT(*) OVER()
							   ,a.s3ObjectKey
							   ,a.s3ObjectUrl
						   FROM Inventario.v_Articulo a
						   WHERE a.idEntidad = @idEntidad  '

			IF @idSubFamilia > 0
				BEGIN 
					SET @sql = @sql + 'AND a.idSubFamilia = @idSubFamilia '
				END 

			IF @idMedida > 0
				BEGIN
					SET @sql = @sql + 'AND a.idMedida = @idMedida '
				END

			IF @idMarca > 0
				BEGIN
					SET @sql = @sql + 'AND a.idMarca = @idMarca '
				END

			IF @idModelo > 0 
				BEGIN
					SET @sql = @sql + 'AND a.idModelo = @idModelo '
				END 

			IF @idTipoIva > 0
				BEGIN
					SET @sql = @sql + 'AND a.idTipoIva = @idTipoIva '
				END 

			IF @estado IN (1,0)
				BEGIN
					SET @sql = @sql + 'AND a.estado  = @estado '
				END

			IF @checkBoxFraccionado = 1 
				BEGIN
					SET @sql = @sql + 'AND a.fraccionado = 1 '
				END 

			IF @checkBoxInventario = 1
				BEGIN
					SET @sql = @sql + 'AND a.llevaInventario = 1 '
				END 

			
			IF @byStock = 1
				BEGIN 
					SET @sql = @sql + 'AND a.stock > 0 AND a.llevaInventario = 1 '
				END
					
			IF @byStock = 2
				BEGIN 
					SET @sql = @sql + 'AND a.stock <= 0 AND a.llevaInventario = 1 '
				END 
				
			IF @bySearch IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND (a.descripcion LIKE''%''+ @bySearch +''%'' OR a.codigo LIKE''%'' + @bySearch +''%'' OR a.codigoBarra LIKE''%'' + @bySearch +''%'') '	
				END 
			
			SET @sql = @sql+ 'ORDER BY a.idArticulo DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY ' 

			
			EXEC sp_executesql  @sql
						       ,@params 
						       ,@idEntidad    = @idEntidad
						       ,@bySearch     = @bySearch
						       ,@idSubFamilia = @idSubFamilia
							   ,@idMedida     = @idMedida
							   ,@idMarca      = @idMarca
							   ,@idModelo     = @idModelo
							   ,@idTipoIva    = @idTipoIva
						       ,@estado       = @estado
							   ,@pageIndex    = @pageIndex
							   ,@pageSize     = @pageSize
			RETURN
		END 

	--> Codigo de barra 
	IF @tipo = 2
		BEGIN

			SELECT @bySearch = bySearch FROM OPENJSON(@json) WITH (bySearch VARCHAR(500) '$.bySearch')

			IF EXISTS (SELECT 1 FROM Inventario.v_Articulo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 AND codigo = @bySearch )	
				BEGIN
					SELECT idArticulo,llevaInventario FROM dbo.Articulo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 AND codigo = @bySearch
					RETURN
				END 

			IF EXISTS (SELECT 1 FROM Inventario.v_Articulo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 AND codigoBarra = @bySearch)	
				BEGIN
					SELECT idArticulo,llevaInventario FROM dbo.Articulo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 AND codigoBarra = @bySearch
					RETURN
				END 
			
			IF EXISTS (SELECT 1  FROM dbo.ArticuloCodigoBarra ac  WITH (NOLOCK) INNER JOIN dbo.Articulo a WITH (NOLOCK) ON a.idArticulo = ac.idArticulo WHERE a.idEntidad  = @idEntidad AND ac.codigoBarra = @bySearch AND a.estado = 1)
				BEGIN
					SELECT ac.idArticulo,llevaInventario FROM dbo.ArticuloCodigoBarra ac WITH (NOLOCK) INNER JOIN dbo.Articulo a WITH (NOLOCK) ON a.idArticulo = ac.idArticulo WHERE a.idEntidad  = @idEntidad AND ac.codigoBarra = @bySearch AND a.estado = 1
					RETURN 
				END 
			RETURN 
		END 

	--> Lista de Precio
	IF @tipo = 3
		BEGIN 
			
			SELECT
				 @bySearch            = REPLACE(bySearch,SPACE(1),'%')
				,@byStock             = byStock
				,@pageIndex           = pageIndex
				,@pageSize            = pageSize
				,@byColumn            = byColumn
			FROM OPENJSON(@json) WITH 
			(   bySearch   VARCHAR(500) '$.bySearch'
			   ,byStock				INT '$.byStock'
			   ,pageIndex			INT '$.pageIndex'
			   ,pageSize            INT '$.pageSize'
			   ,bycolumn     VARCHAR(5) '$.byColumn'
			)


			SET @params  = '@idEntidad INT
						   ,@bySearch VARCHAR(250)
						   ,@pageIndex INT
						   ,@pageSize INT'

			SET @sql  = 'SELECT a.idArticulo
							   ,a.idMedida
							   ,a.code_unique
							   ,codigo            = ISNULL(a.codigo,''Ninguno'')
							   ,descripcion       = ISNULL(a.descripcion, ''Ninguno'')
							   ,a.codigoBarra
							   ,precioCosto   
							   ,estado       
							   ,stock        
							   ,observaciones 
							   ,subFamilia    
							   ,medida       
							   ,modelo 
							   ,marca             = ISNULL(a.marca,''Ninguno'')
							   ,modelo            = ISNULL(a.modelo, ''Ninguno'')
							   ,tipoIva           = CAST(CAST(a.porcentaje as decimal(15,0)) AS VARCHAR)+''%''
							   ,tipoArticulo      = ISNULL(a.tipoArticulo,''Ninguna'')
							   ,style             = a.colorRow 
							   ,precioSinSubsidio = ISNULL(precioSinSubsidio, 0)
							   ,a.stockMinimo
							   ,tarifa            = (SELECT precioConIva = ISNULL(ap.precioConIva, 0.00000)
													       ,tarifa       = Helper.IsNullOrEmpty(ta.descripcion)
											        FROM dbo.ArticuloPvP ap WITH (NOLOCK)
											        LEFT JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa =  ap.idTarifa
											        WHERE ap.idArticulo = a.idArticulo FOR JSON PATH)
							   ,totalRecords = COUNT(*) OVER()
						FROM Inventario.v_Articulo a
						WHERE a.idEntidad = @idEntidad AND a.estado = 1  '

			
			
			IF @byStock = 1
				BEGIN 
					SET @sql = @sql+' AND a.stock > 0 AND a.llevaInventario = 1 '
				END
					
			IF @byStock = 2
				BEGIN 
					SET @sql = @sql+' AND a.stock <= 0 AND a.llevaInventario = 1 '
				END 

			IF @bySearch IS NOT NULL
				BEGIN
					
					IF @byColumn = 'DESC'
						BEGIN
							SET @sql = @sql+ 'AND a.descripcion LIKE ''%'' + @bySearch + ''%'' '
						END 

					IF @byColumn = 'COD'
						BEGIN
							SET @sql = @sql+ 'AND a.codigo LIKE ''%'' + @bySearch + ''%'' '
						END 

					IF @byColumn = 'AUX'
						BEGIN
							SET @sql = @sql+ 'AND a.codigoAuxiliar LIKE ''%'' + @bySearch +''%'' '
						END 

					IF @byColumn = 'BAR'
						BEGIN
							SET @sql = @sql+ 'AND a.codigoBarra LIKE ''%'' + @bySearch + ''%'' '
						END
				END 
			
			SET @sql = @sql+ ' ORDER BY a.idArticulo DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY' 

			EXEC sp_executesql  @sql
						       ,@params 
						       ,@idEntidad    = @idEntidad
						       ,@bySearch     = @bySearch
							   ,@pageIndex    = @pageIndex
							   ,@pageSize     = @pageSize
			RETURN 
		END

	--> Articulos Fraccionados 
	IF @tipo = 4
		BEGIN
			
			SELECT @idArticulo = idArticulo FROM OPENJSON(@json) WITH (idArticulo INT '$.idArticulo')

			SELECT av.idArticuloFraccionado
				  ,medida = av.medidaFraccionada
				  ,stock  = av.catidadFraccionado
				  ,tarifas = (SELECT precioVenta = pv.precioConIva
								    ,tarifa      = ta.descripcion
						      FROM dbo.ArticuloFraccionadoPvP pv WITH (NOLOCK) 
							  INNER JOIN dbo.Tarifa           ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
				              WHERE pv.idArticuloFraccionado = av.idArticuloFraccionado FOR JSON PATH)
			FROM v_Articulo_Fraccionado av WITH (NOLOCK)
			WHERE av.idArticulo = @idArticulo

			RETURN
		END
		
	--> DataForm 
	IF @tipo = 5
		BEGIN
			SELECT idEstablecimiento,nombreComercial,defaultEstab,idBodega,bodega,defaultBodega FROM v_Bodega_Asign WITH (NOLOCK) WHERE idUsuarioRol = @idRol ORDER BY defaultEstab DESC

            SELECT nroPrecio FROM Config.v_Sistema_Decimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTrasaccion = 'AL'

			SELECT idFamilia    = f.idFamilia
				  ,idSubFamilia = sf.idSubFamilia
				  ,familia      = ISNULL(f.descripcion,'Ninguna')
				  ,subFamilia   = sf.descripcion
				  ,sf.siglas
				  ,sf.ultimoSecuencial
                  ,sf.siglas + CAST(sf.ultimoSecuencial as varchar) as codigo
			FROM dbo.SubFamilia sf  WITH (NOLOCK)
			 LEFT JOIN Familia   f  WITH (NOLOCK) ON sf.idFamilia = f.idFamilia 
			WHERE sf.idEntidad = @idEntidad AND sf.estado = 1

			SELECT idFamilia, descripcion      
            FROM dbo.Familia WITH (NOLOCK) 
            WHERE ActividadEconomicaId IN (SELECT ea.ActividadEconomicaId FROM v_Estab_Asign ea WITH (NOLOCK) WHERE ea.idUsuarioRol = @idRol)    
            AND estado = 1
	
			SELECT idMedida,codigo,descripcion FROM dbo.Medida  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idModelo,codigo,descripcion FROM dbo.Modelo  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idMarca,codigo,descripcion  FROM dbo.Marca   WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

            SELECT idTipoArticulo,descripcion FROM dbo.TipoArticulo WHERE estado = 1 

            SELECT * FROM dbo.TipoIva WHERE estado = 1

            SELECT * FROM dbo.TipoIce WHERE estado = 1
	        
            SELECT idTarifa,descripcion,codigo,predeterminada FROM dbo.Tarifa WHERE idEntidad = @idEntidad AND estado = 1 ORDER BY codigo ASC

            SELECT * FROM Inventario.Etiqueta WHERE idEntidad = @idEntidad AND estado = 1
			
            RETURN
		END 

	--> Datos Articulo Venta Web
	IF @tipo = 6
		BEGIN
		    SELECT @idArticulo = idArticulo ,@idBodega = idBodega FROM OPENJSON(@json) WITH (idArticulo INT '$.idArticulo', idBodega INT '$.idBodega')

			SELECT idArticulo           = a.idArticulo
				  ,idMedida             = ISNULL(a.idMedida,0)
				  ,idTipoIva            = ti.idTipoIva
				  ,codigoAuxiliar       = ISNULL(a.codigoAuxiliar, 'S/N')
				  ,descripcion          = a.descripcion
				  ,valorIce             = ISNULL(a.valorIce,0)
				  ,llevaInventario      = a.llevaInventario
				  ,datosAdicionales     = ISNULL(a.datosAdicionales, 0) 
				  ,productoFraccionable = a.productoFraccionable
				  ,precioCosto          = a.precioCosto
				  ,precioSinSubsidio    = ISNULL(a.precioSinSubsidio,0)
				  ,nombreTipoIva        = ti.descripcion
				  ,tarifa               = ti.porcentaje
				  ,codigoPorcentaje     = CAST(ti.codigoPorcentaje as varchar)
				  ,codigoArticulo       = IIF(ti.porcentaje > 0,'*','')+a.codigo
				  ,stock                = a.stock
				  ,cantMinimaVentaPorMayor
			FROM dbo.Articulo a 
			INNER JOIN dbo.TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = a.idTipoIva
			 LEFT JOIN dbo.Medida  me WITH (NOLOCK) ON me.idMedida  = a.idMedida
			WHERE a.idArticulo = @idArticulo

			SELECT idMedida     = m.idMedida 
			      ,descripcion  = m.descripcion
			      ,tarifas		= (SELECT afs.idTarifa,afs.precioVenta,afs.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor
								   FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								   INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								   WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								   ORDER BY ta.predeterminada DESC FOR JSON PATH)
			      ,orden = IIF(af.gestionVenta = 1,1,3)
                  ,af.conversion
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			WHERE af.idArticulo = @idArticulo AND af.estado = 1

			SELECT 
				m.idMedida
			   ,m.descripcion
			   ,tarifas		 = (SELECT ap.idTarifa,ap.precioVenta,ap.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor 
								FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								WHERE ap.idArticulo = a.idArticulo
								ORDER BY ta.predeterminada DESC FOR JSON PATH)
			  ,orden = 2
              ,1 as conversion
			FROM dbo.Articulo     a WITH (NOLOCK)
			INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			WHERE a.idArticulo = @idArticulo AND a.estado = 1
			ORDER BY orden ASC
                
            SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock WHERE idArticulo = @idArticulo 

			SELECT * FROM Compra.InfoAdicional WITH (NOLOCK) WHERE idArticulo = @idArticulo AND estado = 1

			RETURN 
		END

	--> Configuracion Stock
	IF @tipo = 7
		BEGIN
			
			SELECT @idArticulo = idArticulo
                  ,@idBodega   = idBodega 
                  ,@cantidad   = cantidad * -1
            FROM OPENJSON(@json) WITH
            (
                idArticulo INT          
               ,idBodega   INT          
               ,cantidad   NUMERIC(18,5)
            )

           
			SELECT TOP 1 @stock = cantidad - @cantidad FROM Inventario.Stock WITH (NOLOCK) WHERE idBodega = @idBodega AND idArticulo = @idArticulo

            --> No permitir la venta de artículos sin stock
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Notificacion WITH (NOLOCK) WHERE codigo = 'NPS' AND idEntidad = @idEntidad AND estado = 1)
				BEGIN
					IF @stock < 0
						BEGIN
							SELECT '0' code
							      ,descripcion + ' <b>(' + codigo + ')</b> stock de : ' + CAST(cantidad as varchar) + ' cantidad a vender es de: ' + CAST(@cantidad as varchar) as 'message'
								  ,'ARTICULO SIN STOCK EN LA BODEGA ' + bodega as 'titleSms'
							FROM Inventario.v_Articulo_Stock WITH (NOLOCK) 
							WHERE idArticulo = @idArticulo 
							  AND idBodega = @idBodega

							RETURN 
						END 
				END 
	        
            --> Mostrar notificacion de artículos sin stock 
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Notificacion WITH (NOLOCK) WHERE codigo = 'MNS' AND idEntidad = @idEntidad AND estado = 1)
				BEGIN
					IF @stock <= 0
						BEGIN
							SELECT '2' as 'code'
							      ,'EL ARTICULO: '+'<b>'+descripcion+'</b>'+' TIENE UN STOCK DE '+CAST(CAST(stock as numeric(18,2)) as varchar) as 'message'
								  ,'ARTICULO CON STOCK CERO' as 'titleSms'
							FROM dbo.Articulo WITH (NOLOCK) 
							WHERE idArticulo = @idArticulo
							RETURN 
						END
				END 

            --> Mostrar notificacion de artículos con stock mínimo
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Notificacion WITH (NOLOCK) WHERE codigo = 'MNM' AND idEntidad = @idEntidad AND estado = 1)
				BEGIN
                    
                    SELECT TOP 1 @stockMinimo = stockMinimo FROM Inventario.v_Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo

					IF @stock <= @stockMinimo 
						BEGIN
							SELECT '2' as 'code'
							      ,'EL ARTICULO: '+'<b>'+descripcion+'</b>'+' TIENE UN STOCK DE '+CAST(stock AS nvarchar) as 'message'
								  ,'ARTICULO BAJO STOCK MÍMINO' as 'titleSms'
							FROM dbo.Articulo WITH (NOLOCK) 
							WHERE idArticulo = @idArticulo
							RETURN 
						END 
				END 
			SELECT '1'code,'Correct!' as 'message'
			RETURN
		END 

	--> Resturante 
	IF @tipo = 8
		BEGIN

			SELECT nroPrecio FROM Config.v_Sistema_Decimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTrasaccion = 'CD'

			SELECT idFamilia
                    , descripcion 
            FROM dbo.Familia WITH (NOLOCK) 
            WHERE ActividadEconomicaId IN (SELECT ea.ActividadEconomicaId FROM v_Estab_Asign ea WITH (NOLOCK) WHERE ea.idUsuarioRol = @idRol)
            AND estado = 1
			
			SELECT
				 idFamilia    = f.idFamilia
				,idSubFamilia = sf.idSubFamilia
				,familia      = f.descripcion
				,subFamilia   = sf.descripcion
				,sf.siglas
				,sf.ultimoSecuencial
			FROM dbo.SubFamilia sf  WITH (NOLOCK)
			INNER JOIN Familia f    WITH (NOLOCK) ON sf.idFamilia = f.idFamilia 
			WHERE sf.idEntidad = @idEntidad AND sf.estado = 1

			SELECT idMedida,codigo,descripcion FROM dbo.Medida  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idTipoIva, descripcion, codigo, porcentaje FROM TipoIva WHERE estado = 1

			SELECT idTarifa,descripcion,codigo,predeterminada FROM dbo.Tarifa WHERE idEntidad = @idEntidad AND estado = 1 ORDER BY codigo ASC

			RETURN 
		END 
	
	--> Articulos Importados 
	IF @tipo = 9
		BEGIN
			SELECT @idBodega = idBodega FROM OPENJSON(@json) WITH (idBodega INT '$.idBodega')

			SELECT TOP 75
			       a.idArticulo
				  ,a.idMedida
				  ,a.code_unique
				  ,codigo        = ISNULL(a.codigo,'Ninguno')
				  ,descripcion   = ISNULL(a.descripcion, 'Ninguno')
				  ,precioCosto   = a.precioCosto
				  ,estado        = a.estado
				  ,stock         = a.stock 
				  ,observaciones = ISNULL(a.observaciones, '')
				  ,imagen        = a.imagen
				  ,subFamilia    = ISNULL(sf.descripcion, 'Ninguna')
				  ,medida        = Helper.IsNullOrEmpty(me.descripcion) 
				  ,marca         = Helper.IsNullOrEmpty(m.descripcion)
				  ,modelo        = Helper.IsNullOrEmpty(mo.descripcion)
				  ,tipoIva       = CAST(CAST(ti.porcentaje as decimal(15,0)) AS VARCHAR)+'%'
				  ,tipoArticulo  = ISNULL(ta.descripcion,'Ninguna')
				  ,style         = CASE WHEN a.stock <= 0 THEN 'badge badge-danger' 
									    WHEN a.stock > 0 AND a.stock < a.stockMinimo  THEN 'badge badge-warning'
									    ELSE ''
								   END 
				,precioSinSubsidio = ISNULL(precioSinSubsidio, 0)
				,a.stockMinimo
			FROM dbo.Articulo           a WITH (NOLOCK)
			LEFT JOIN dbo.SubFamilia   sf WITH (NOLOCK) ON sf.idSubFamilia   = a.idSubFamilia
			LEFT JOIN dbo.TipoArticulo ta WITH (NOLOCK) ON ta.idTipoArticulo = a.idTipoArticulo
			LEFT JOIN dbo.Medida       me WITH (NOLOCK) ON me.idMedida       = a.idMedida
			LEFT JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva      = a.idTipoIva
			LEFT JOIN Marca             m WITH (NOLOCK) ON m.idMarca         = a.idMarca	
			LEFT JOIN Modelo           mo WITH (NOLOCK) ON mo.idModelo       = a.idModelo
			WHERE a.idEntidad = @idEntidad 
			  AND a.importacion = 1 
			  AND a.llevaInventario = 1 
			  AND a.estado = 1
			  AND a.stock > 0
			  AND a.idArticulo NOT IN (SELECT d.idArticulo FROM ConsolidacionInventarioDetalle d) 
            RETURN 
		END 

    --> Resturante Orden
    IF @tipo = 10
        BEGIN 
            SELECT @idArticulo = idArticulo FROM OPENJSON(@json) WITH (idArticulo INT '$.idArticulo')             

            SELECT idArticulo           = a.idArticulo
				  ,idMedida             = ISNULL(a.idMedida,0)
				  ,idTipoIva            = a.idTipoIva
				  ,descripcion          = a.descripcion
				  ,llevaInventario      = a.llevaInventario
				  ,precioCosto          = a.precioCosto
                  ,precioSinSubsidio    = ISNULL(precioSinSubsidio,0)
                  ,tarifaImpuesto
				  ,tarifa               = a.porcentaje
				  ,codigoPorcentaje     = CAST(a.codigoPorcentaje as varchar)
				  ,codigoArticulo       = IIF(a.porcentaje > 0,'*','')+a.codigo
				  ,stock                = a.stock
                  ,s3ObjectKey
	              ,s3ObjectUrl 			 
			FROM Inventario.v_Articulo a 
			WHERE a.idArticulo = @idArticulo

            SELECT idMedida     = m.idMedida 
			      ,descripcion  = m.descripcion
			      ,tarifas		= (SELECT afs.idTarifa,afs.precioVenta,afs.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor, ta.predeterminada
								   FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								   INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								   WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								   ORDER BY ta.predeterminada DESC FOR JSON PATH)
			      ,orden = IIF(af.gestionVenta = 1,1,3)
                  ,af.conversion
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			WHERE af.idArticulo = @idArticulo AND af.estado = 1

			SELECT 
				m.idMedida
			   ,m.descripcion
			   ,tarifas		 = (SELECT ap.idTarifa,ap.precioVenta,ap.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor, ta.predeterminada
								FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								WHERE ap.idArticulo = a.idArticulo
								ORDER BY ta.predeterminada DESC FOR JSON PATH)
			  ,orden = 2
              ,1 as conversion
			FROM dbo.Articulo     a WITH (NOLOCK)
			INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			WHERE a.idArticulo = @idArticulo AND a.estado = 1
			ORDER BY orden ASC

            SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock WHERE idArticulo = @idArticulo 
            RETURN 
        END 

    --> Filters
    IF @tipo = 11
        BEGIN
            SELECT idSubFamilia,descripcion FROM SubFamilia WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idMedida,descripcion,codigo FROM Medida WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idMarca,descripcion FROM Marca WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idModelo,descripcion FROM Modelo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1
			
			SELECT idTipoIva,descripcion,codigoPorcentaje FROM TipoIva WITH (NOLOCK) WHERE estado = 1

            RETURN 
        END 

     --> Datos Articulo Venta App 
	IF @tipo = 12
		BEGIN
		    SELECT @idArticulo = idArticulo ,@idBodega = idBodega FROM OPENJSON(@json) WITH (idArticulo INT '$.idArticulo', idBodega INT '$.idBodega')

			SELECT idArticulo           = a.idArticulo
				  ,idMedida             = ISNULL(a.idMedida,0)
				  ,idTipoIva            = ti.idTipoIva
				  ,codigoAuxiliar       = ISNULL(a.codigoAuxiliar, 'S/N')
				  ,descripcion          = a.descripcion
				  ,valorIce             = ISNULL(a.valorIce,0)
				  ,llevaInventario      = a.llevaInventario
				  ,datosAdicionales     = ISNULL(a.datosAdicionales, 0) 
				  ,productoFraccionable = a.productoFraccionable
				  ,precioCosto          = a.precioCosto
				  ,precioSinSubsidio    = ISNULL(a.precioSinSubsidio,0)
				  ,nombreTipoIva        = ti.descripcion
				  ,tarifa               = ti.porcentaje
				  ,codigoPorcentaje     = CAST(ti.codigoPorcentaje as varchar)
				  ,codigoArticulo       = IIF(ti.porcentaje > 0,'*','')+a.codigo
				  ,stock                = a.stock
				  ,cantMinimaVentaPorMayor
                  ,medidas              = ( SELECT
				                                m.idMedida
			                                   ,tarifas		 = (SELECT ap.idTarifa,ap.precioVenta,ap.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor, ta.predeterminada 
								                                FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								                                INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								                                WHERE ap.idArticulo = a.idArticulo
								                                ORDER BY ta.predeterminada DESC FOR JSON PATH)
			                                  ,orden = 2
                                              ,1 as conversion
			                                FROM dbo.Articulo     a WITH (NOLOCK)
			                                INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			                                WHERE a.idArticulo = @idArticulo AND a.estado = 1
			                                ORDER BY orden ASC FOR JSON PATH)
			FROM dbo.Articulo       a WITH (NOLOCK)
			INNER JOIN dbo.TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = a.idTipoIva
		    LEFT JOIN dbo.Medida  me WITH (NOLOCK) ON me.idMedida  = a.idMedida
			WHERE a.idArticulo = @idArticulo
                            
            SELECT idArticulo, idBodega, fechaConsolidacion FROM Inventario.Stock WHERE idArticulo = @idArticulo
            SELECT * FROM Compra.InfoAdicional WITH (NOLOCK) WHERE idArticulo = @idArticulo AND estado = 1			
            RETURN 
		END
    
    --> Filter Report
    IF @tipo = 13
        BEGIN

           SELECT codEstab,idEstablecimiento,nombreComercial,defaultEstab,idBodega,bodega,defaultBodega FROM v_Bodega_Asign WITH (NOLOCK) WHERE idUsuarioRol = @idRol ORDER BY defaultEstab DESC
           
           SELECT sf.idSubFamilia
                 ,sf.descripcion as subFamilia
                 ,sf.codigo
                 ,fa.descripcion as familia
           FROM dbo.SubFamilia    sf WITH (NOLOCK) 
           INNER JOIN dbo.Familia fa WITH (NOLOCK) ON fa.idFamilia = sf.idFamilia
           WHERE idEntidad = @idEntidad

           RETURN 
        END 

    --> Data Compra
    IF @tipo = 14
        BEGIN
            
            SELECT @idArticulo = idArticulo  FROM OPENJSON(@json) WITH (idArticulo INT)

            SELECT a.idArticulo
                  ,a.idTipoIva
                  ,CASE WHEN ti.porcentaje > 0 THEN '* '+a.codigo ELSE a.codigo END  as codigoArticulo
                  ,a.descripcion 
                  ,ISNULL(tic.valor,0)           as valorIce
                  ,a.llevaInventario
                  ,ISNULL(a.datosAdicionales, 0) as datosAdicionales
                  ,a.productoFraccionable
                  ,a.stock 
                  ,im.codigo
                  ,CAST(ti.codigoPorcentaje as varchar) as codigoPorcentaje
                  ,ti.porcentaje                        as tarifa
            FROM dbo.Articulo        a WITH (NOLOCK)
            INNER JOIN dbo.TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva  = a.idTipoIva
            INNER JOIN dbo.Impuesto im WITH (NOLOCK) ON im.idImpuesto = ti.idImpuesto
             LEFT JOIN dbo.TipoIce tic WITH (NOLOCK) ON tic.idTipoIce = a.idTipoIce 
            WHERE a.idArticulo = @idArticulo

            SELECT me.idMedida 
                  ,me.descripcion as medida
                  ,a.precioCosto
                  ,1 as conversion
            FROM Articulo      a WITH (NOLOCK) 
            INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = a.idMedida 
            WHERE a.idArticulo = @idArticulo

            SELECT me.idMedida
                  ,me.descripcion as medida
                  ,af.precioCostoFraccionado as precioCostoFraccionado
                  ,af.conversion
            FROM ArticuloFraccionado af WITH (NOLOCK) 
            INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida = af.idMedida 
            WHERE af.idArticulo = @idArticulo 

            SELECT et.idEtiqueta ,et.descripcion, et.etiquetas
            FROM Inventario.Etiqueta et WITH (NOLOCK)
            INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idEtiqueta = et.idEtiqueta
            WHERE ar.idArticulo = @idArticulo

            RETURN 
        END 
	
    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
	RETURN 
END
