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
--Almacen.Articulo_Get 28, '{"tipo":10,"idArticulo":5}'
-- Inventario.Articulo_Get 28, '{"idArticulo":77528,"idBodega":128,"tipo":10}'
-- Inventario.Articulo_Get 28, '{"tipo":7,"idArticulo":32546,"cantidad":"2","idBodega":149,"idMedida":278}'
IF OBJECT_ID(N'Inventario.Articulo_Get', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Articulo_Get
GO
CREATE PROCEDURE Inventario.Articulo_Get @idRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @tipo INT
	DECLARE @idEntidad INT 
	DECLARE @pageIndex INT
	DECLARE @pageSize INT

	-- Tipos de Busqueda 
	DECLARE @checkBoxSubFamilia  BIT, @idSubFamilia INT
	DECLARE @checkBoxMedida      BIT, @idMedida     INT ,@fraccion NUMERIC(18,5)
	DECLARE @checkBoxMarca       BIT, @idMarca      INT
	DECLARE @checkBoxModelo      BIT, @idModelo     INT
	DECLARE @checkBoxFraccionado BIT 
	DECLARE @checkBoxTipoIva	 BIT, @idTipoIva    INT  
	DECLARE @checkBoxStatus      BIT, @estado       BIT
	DECLARE @checkBoxStock       BIT, @byStock      INT
	DECLARE @checkBoxInventario  BIT 
	DECLARE @checkBoxArticulo    BIT, @idArticulo   INT

	DECLARE @idBodega INT
	DECLARE @bySearch NVARCHAR(300)
	DECLARE @byColumn VARCHAR(10)
	DECLARE @params NVARCHAR(MAX)
	DECLARE @sql NVARCHAR(MAX)

	DECLARE @ventaStockMinimo BIT
	DECLARE @stockCantidad BIT 
    DECLARE @ventaStockCero BIT 
    DECLARE @stock NUMERIC(15,5)
	DECLARE @stockMinimo NUMERIC(18,5)
	DECLARE @porcentaje NUMERIC(15,5)
	DECLARE @cantidad NUMERIC(18,5)

	SELECT TOP 1  @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')
	
	-- LISTA DE GESTIOS DE ARTICULOS -- 
	IF @tipo = 1
		BEGIN
			
			SELECT
				 @bySearch            = REPLACE(bySearch,SPACE(1),'%')
				,@checkBoxSubFamilia  = checkBoxSubFamilia ,@idSubFamilia = bySubFamilia
				,@checkBoxMedida      = checkBoxMedida     ,@idMedida     = byMedida
				,@checkBoxMarca       = checkBoxMarca      ,@idMarca      = byMarca
				,@checkBoxModelo      = checkBoxModelo     ,@idModelo     = byModelo
				,@checkBoxTipoIva     = checkBoxTipoIva    ,@idTipoIva    = byTipoIva
				,@checkBoxStatus      = checkBoxStatus     ,@estado       = estado
				,@checkBoxStock       = checkBoxStock      ,@byStock      = byStock
				,@checkBoxFraccionado = checkBoxFraccionado
				,@checkBoxInventario  = checkBoxInventario
				,@pageIndex           = pageIndex
				,@pageSize            = pageSize
			FROM OPENJSON(@json)
			WITH 
			(   bySearch   VARCHAR(500) '$.bySearch'
			   ,checkBoxSubFamilia  BIT '$.checkBoxSubFamilia',bySubFamilia INT '$.bySubFamilia'
			   ,checkBoxMedida      BIT '$.checkBoxMedida'    ,byMedida     INT '$.byMedida'
			   ,checkBoxMarca       BIT '$.checkBoxMarca'     ,byMarca      INT '$.byMarca'
			   ,checkBoxModelo      BIT '$.checkBoxModelo'    ,byModelo     INT '$.byModelo'
			   ,checkBoxTipoIva		BIT '$.checkBoxTipoIva'   ,byTipoIva	INT '$.byTipoIva'
			   ,checkBoxStatus      BIT '$.checkBoxStatus'    ,estado	    BIT '$.status'
			   ,checkBoxStock       BIT '$.checkBoxStock'     ,byStock	    INT '$.byStock'
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

			IF @checkBoxSubFamilia =  1
				BEGIN 
					SET @sql = @sql+'AND a.idSubFamilia = @idSubFamilia '
				END 

			IF @checkBoxMedida = 1
				BEGIN
					SET @sql = @sql+'AND a.idMedida = @idMedida '
				END

			IF @checkBoxMarca = 1
				BEGIN
					SET @sql = @sql+'AND a.idMarca = @idMarca '
				END

			IF @checkBoxModelo = 1
				BEGIN
					SET @sql = @sql+'AND a.idModelo = @idModelo '
				END 

			IF @checkBoxTipoIva = 1
				BEGIN
					SET @sql = @sql+'AND a.idTipoIva = @idTipoIva '
				END 

			IF @checkBoxStatus = 1
				BEGIN
					SET @sql = @sql+'AND a.estado  = @estado '
				END

			IF @checkBoxFraccionado = 1 
				BEGIN
					SET @sql = @sql+'AND a.fraccionado = 1 '
				END 

			IF @checkBoxInventario = 1
				BEGIN
					SET @sql = @sql+'AND a.llevaInventario = 1 '
				END 

			IF @checkBoxStock =  1
				BEGIN
					IF @byStock = 1
						BEGIN 
							SET @sql = @sql+' AND a.stock > 0 AND a.llevaInventario = 1 '
						END
					
					IF @byStock = 2
						BEGIN 
							SET @sql = @sql+' AND a.stock <= 0 AND a.llevaInventario = 1 '
						END 
				END 

			IF @bySearch IS NOT NULL
				BEGIN
					SET @sql = @sql+' AND (a.descripcion LIKE''%''+ @bySearch +''%'' OR a.codigo LIKE''%'' + @bySearch +''%'' OR a.codigoBarra LIKE''%'' + @bySearch +''%'')'	
				END 
			
			SET @sql = @sql+ ' ORDER BY a.idArticulo DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY' 

			
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

			SELECT idSubFamilia,descripcion FROM SubFamilia WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idMedida,descripcion,codigo FROM Medida WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idMarca,descripcion FROM Marca WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idModelo,descripcion FROM Modelo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1
			
			SELECT idTipoIva,descripcion,codigoPorcentaje FROM TipoIva WITH (NOLOCK) WHERE estado = 1

			RETURN
		END 

	-- BUSQUEDA SOLO POR CODIGO DESDE LAS VENTAS --- 
	IF @tipo = 2
		BEGIN

			SELECT @bySearch = REPLACE(bySearch,SPACE(1),'%') FROM OPENJSON(@json) WITH (bySearch VARCHAR(500) '$.bySearch')

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

	-- BUSQUEDA DE ARTICULOS PARA CONSULTAS DE PRECIOS --
	IF @tipo = 3
		BEGIN 
			
			SELECT
				 @bySearch            = REPLACE(bySearch,SPACE(1),'%')
				,@checkBoxStock       = checkBoxStock
				,@byStock             = byStock
				,@pageIndex           = pageIndex
				,@pageSize            = pageSize
				,@byColumn            = byColumn
			FROM OPENJSON(@json)
			WITH 
			(   bySearch   VARCHAR(500) '$.bySearch'
			   ,checkBoxStock       BIT '$.checkBoxStock'
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

			
			IF @checkBoxStock =  1
				BEGIN
					IF @byStock = 1
						BEGIN 
							SET @sql = @sql+' AND a.stock > 0 AND a.llevaInventario = 1 '
						END
					
					IF @byStock = 2
						BEGIN 
							SET @sql = @sql+' AND a.stock <= 0 AND a.llevaInventario = 1 '
						END 
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

			PRINT @sql

			EXEC sp_executesql  @sql
						       ,@params 
						       ,@idEntidad    = @idEntidad
						       ,@bySearch     = @bySearch
							   ,@pageIndex    = @pageIndex
							   ,@pageSize     = @pageSize
			RETURN 
		END

	-- LISTA PARA MOSTAR LOS PRECIOS DE LOS ARTICULOS FRACCIONADOS --- 
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
		
	-- DATOS PARA EL DATAFORM DE ARTICULOS 
	IF @tipo = 5
		BEGIN
			
			SELECT idEstab_Asig,idEstablecimiento,codEstab,nombreComercial,predeterminado FROM v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @idRol ORDER BY predeterminado DESC

			SELECT idEstab_Asig,idBodega,bodega,defaultBodega FROM v_Bodega_Asign WITH (NOLOCK) WHERE idUsuarioRol = @idRol ORDER BY defaultBodega DESC

			SELECT 
				 idFamilia    = f.idFamilia
				,idSubFamilia = sf.idSubFamilia
				,familia      = ISNULL(f.descripcion,'Ninguna')
				,subFamilia   = sf.descripcion
				,sf.siglas
				,sf.ultimoSecuencial
			FROM dbo.SubFamilia sf  WITH (NOLOCK)
			 LEFT JOIN Familia f    WITH (NOLOCK) ON sf.idFamilia = f.idFamilia 
			WHERE sf.idEntidad = @idEntidad AND sf.estado = 1

			SELECT idFamilia, descripcion      
            FROM dbo.Familia WITH (NOLOCK) 
            WHERE ActividadEconomicaId IN (SELECT ea.ActividadEconomicaId FROM v_Estab_Asign ea WITH (NOLOCK) WHERE ea.idUsuarioRol = @idRol)    
            AND estado = 1
	
			SELECT idMedida,codigo,descripcion FROM dbo.Medida  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idModelo,codigo,descripcion FROM dbo.Modelo  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idMarca,codigo,descripcion  FROM dbo.Marca   WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

            --Para Crud svelte 
            SELECT idTipoArticulo,descripcion FROM dbo.TipoArticulo WHERE estado = 1 

            SELECT * FROM dbo.TipoIva WHERE estado = 1
	        SELECT idTarifa,descripcion,codigo,predeterminada FROM dbo.Tarifa WHERE idEntidad = @idEntidad AND estado = 1 ORDER BY codigo ASC
			RETURN 

            
		END 

	-- LISTA PARA VERIFICAR LOS DATOS DE LA VENTA ----- 
	IF @tipo = 6
		BEGIN
				SELECT @idArticulo = idArticulo FROM OPENJSON(@json) WITH (idArticulo INT '$.idArticulo')

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

			SELECT 
				idMedida     = m.idMedida 
			   ,descripcion  = m.descripcion
			   ,tarifas		 = (SELECT afs.idTarifa,afs.precioVenta,afs.precioConIva,tarifa = UPPER(ta.descripcion),porcentaje = @porcentaje, ta.ventaPorMayor
								FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								ORDER BY ta.predeterminada DESC FOR JSON PATH)
			   ,orden = IIF(af.gestionVenta = 1,1,3)
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			WHERE af.idArticulo = @idArticulo AND af.estado = 1
		
			UNION ALL

			SELECT 
				m.idMedida
			   ,m.descripcion
			   ,tarifas		 = (SELECT ap.idTarifa,ap.precioVenta,ap.precioConIva,tarifa = UPPER(ta.descripcion) ,porcentaje = @porcentaje, ta.ventaPorMayor
								FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								WHERE ap.idArticulo = a.idArticulo
								ORDER BY ta.predeterminada DESC FOR JSON PATH)
			  ,orden = 2
			FROM dbo.Articulo     a WITH (NOLOCK)
			INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			WHERE a.idArticulo = @idArticulo AND a.estado = 1
			ORDER BY orden ASC

			SELECT * FROM Compra.InfoAdicional WITH (NOLOCK) WHERE idArticulo = @idArticulo AND estado = 1

			RETURN 
		END

	-- CONFIGURACION DE STOCK PARA LAS VENTAS ------
	IF @tipo = 7
		BEGIN
			
			SELECT @idArticulo = idArticulo
                  ,@idBodega   = idBodega 
                  ,@idMedida   = idMedida
                  ,@cantidad   = cantidad 
            FROM OPENJSON(@json) WITH
            (
                idArticulo INT           '$.idArticulo'
               ,idBodega   INT           '$.idBodega' 
               ,idMedida   INT           '$.idMedida' 
               ,cantidad   NUMERIC(18,5) '$.cantidad'
            )

            SELECT TOP 1 @fraccion = conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idMedida = @idMedida

			SELECT TOP 1 @stock = cantidad FROM Inventario.Stock WITH (NOLOCK) WHERE idBodega = @idBodega AND idArticulo = @idArticulo

			SELECT TOP 1 @stockMinimo = stockMinimo FROM Inventario.v_Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo

			--|| Mostrar notificacion de artículos sin stock || --
			SELECT TOP 1 @stockCantidad  = estado FROM Config.v_Notificacion_Sistema WITH (NOLOCK) WHERE codigo = 'MNS' AND idEntidad = @idEntidad 

			--|| No permitir la venta de artículos sin stock || --
			SELECT TOP 1 @ventaStockCero = estado FROM Config.v_Notificacion_Sistema WITH (NOLOCK) WHERE codigo = 'NPS' AND idEntidad = @idEntidad 

			-- || Mostrar notificacion de artículos con stock mínimo ||--
			SELECT TOP 1 @ventaStockMinimo = estado FROM Config.v_Notificacion_Sistema WITH (NOLOCK) WHERE codigo = 'MNM' AND idEntidad = @idEntidad 

			SELECT  @stock =  @stock - (@cantidad * ISNULL(@fraccion,1))
			
			IF @ventaStockCero = 1
				BEGIN
					IF @stock < 0
						BEGIN
							SELECT '0' code
							      ,descripcion + ' <b>(' + codigo + ')</b> medida '+ medida as 'message'
								  ,'ARTICULO SIN STOCK EN LA BODEGA ' + bodega as 'titleSms'
							FROM Inventario.v_Articulo_Stock WITH (NOLOCK) 
							WHERE idArticulo = @idArticulo 
							  AND idBodega = @idBodega

							RETURN 
						END 
				END 
	
			IF @stockCantidad = 1 
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

			IF @ventaStockMinimo = 1
				BEGIN
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

	-- DATOS PARA EL FORMULARIO DEL ARTICULO RESTAURANTE -- 
	IF @tipo = 8
		BEGIN

			SELECT nroPrecio FROM v_ConfigDecimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTrasaccion = 'CD'

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
	
	-- DATOS PARA CONSOLIDAR LOS ARTICULOS IMPORTADOS -- 
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

    -- DATOS PARA EL RESTAURANTE - ORDEN 
    IF @tipo = 10
        BEGIN 
            SELECT @idArticulo = idArticulo FROM OPENJSON(@json) WITH (idArticulo INT '$.idArticulo')

			SELECT idArticulo
					,idMedida
					,idTipoIva
					,descripcion
					,llevaInventario
					,precioCosto
					,precioSinSubsidio = ISNULL(precioSinSubsidio,0)
					,tarifaImpuesto
					,tarifa            = porcentaje
					,codigoPorcentaje  = CAST(codigoPorcentaje as varchar)
					,codigoArticulo    = codigo 
					,stock    
                    ,s3ObjectKey
	                ,s3ObjectUrl
			FROM Inventario.v_Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo 

			SELECT 
				a.idMedida
			   ,a.medida
			   ,tarifas		 = (SELECT idTarifa, precioVenta, precioConIva, tarifa, precioPredeterminado
								FROM Inventario.v_Articulo_Tarifa  vat
								WHERE vat.idArticulo = a.idArticulo
								ORDER BY precioPredeterminado DESC FOR JSON PATH) 
			FROM Inventario.v_Articulo a WHERE idArticulo = @idArticulo AND estado = 1 
            RETURN 
        END 

	SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
	RETURN 
END
