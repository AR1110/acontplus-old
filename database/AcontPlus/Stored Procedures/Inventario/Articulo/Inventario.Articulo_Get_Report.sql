USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Get]    Script Date: 12/14/2022 8:56:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2023-08-05
-- Description:	SP Para leer los datos de los tipos de reportes relacionado con artiuculos
-- =============================================
--Almacen.Articulo_Get 28, '{"tipo":10,"idArticulo":5}'
IF OBJECT_ID(N'Inventario.Articulo_Get_Report', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Articulo_Get_Report
GO
CREATE PROCEDURE Inventario.Articulo_Get_Report @idRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @tipo INT
	DECLARE @idEntidad INT 
	DECLARE @filtroFecha VARCHAR(50)
	DECLARE @checkBoxSubFamilia  BIT ,@idSubFamilia          INT
	DECLARE @checkBoxStock       BIT ,@byStock               INT
	DECLARE @checkBoxArticulo    BIT ,@idArticulo            INT
	DECLARE @chkProveedor        BIT ,@rucProveedor  VARCHAR(25)
	DECLARE @chkUbicacion        BIT ,@idBodega              INT ,@ubicacion VARCHAR(150)
	DECLARE @checkBoxFecha       BIT ,@fechaInicio      DATETIME ,@fechaFin DATETIME
	DECLARE @checkBoxTransaccion BIT ,@idUsuario             INT
	DECLARE @checkBoxUsuario     BIT ,@codTransaccion VARCHAR(5)

	DECLARE @checkBoxInventario  BIT 
	DECLARE @checkboxDetalleBodegaFiltro BIT 
	DECLARE @byOrder NVARCHAR(10)			
	DECLARE @byOrderCampo NVARCHAR(50)
	DECLARE @params NVARCHAR(MAX)
	DECLARE @sql NVARCHAR(MAX)
	DECLARE @usuario VARCHAR(150)

	SELECT TOP 1  @idEntidad = idEntidad, @usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')
	
	-- REPORTE DE ARTICULOS FRACCIONADOS ---
	IF @tipo = 1
		BEGIN
			
			SELECT @checkBoxArticulo   = checkBoxArticulo
				  ,@idArticulo         = idArticulo 
				  ,@checkBoxSubFamilia = checkboxSubFamilia
				  ,@idSubFamilia       = bySubFamilia
				  ,@chkProveedor       = chkProveedor             
				  ,@rucProveedor       = numeroIdentificacion
			FROM OPENJSON(@json) 
			WITH (checkBoxArticulo             BIT '$.checkBoxArticulo'
			     ,idArticulo                   INT '$.idArticulo'
				 ,checkboxSubFamilia           BIT '$.checkboxSubFamiliaFiltro'
				 ,bySubFamilia                 INT '$.bySubFamilia'
				 ,chkProveedor                 BIT '$.chkProveedor'            
				 ,numeroIdentificacion VARCHAR(25) '$.numeroIdentificacion'
			     )

			SET @params = '@idEntidad INT
			              ,@idArticulo INT
						  ,@idSubFamilia INT
						  ,@rucProveedor VARCHAR(150)'

			SET @sql = 'SELECT articulo           
							  ,codigo
							  ,medida            
							  ,stock              = CAST(stock as numeric(18,2))
							  ,conversion         = CAST(conversion as numeric(18,2))
							  ,catidadFraccionado = CAST(catidadFraccionado AS VARCHAR) + '' '' +  medidaFraccionada
							  ,sobrante           = CAST(CAST(sobrante as numeric(18,2)) as varchar) + '' '' + medida   
						FROM v_Articulo_Fraccionado
						WHERE idEntidad = @idEntidad AND estado = 1 '
			
			IF @checkBoxArticulo = 1 
				BEGIN
					SET @sql = @sql + 'AND idArticulo = @idArticulo '
				END 

			IF @checkBoxSubFamilia = 1
				BEGIN
					SET @sql = @sql + 'AND idSubFamilia = @idSubFamilia '
				END

			IF @chkProveedor = 1
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucProveedor AND codTransaccion = ''E'') '
				END 

			--Entidad 
			SELECT e.ruc
				  ,e.razonSocial 
				  ,e.nombreComercial	
				  ,ISNULL(e.telefono, '')as telefonoEntidad
				  ,ISNULL(e.direccion, '') as direccionEntidad			
				  ,tituloReporte = 'REPORTE DE ARTICULOS FRACCIONADOS'
				  ,usuario       = @usuario			
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad 

			EXEC sp_executesql  @sql
						       ,@params 
						       ,@idEntidad    = @idEntidad
						       ,@idArticulo   = @idArticulo
							   ,@idSubFamilia = @idSubFamilia
							   ,@rucProveedor = @rucProveedor
			RETURN 
		END 

	-- REPORTE DE ARTICULOS CON LISTA DE PRECIO -- 
	IF @tipo = 2
		BEGIN
			
			SET @params = '@idEntidad    INT									
						  ,@idSubFamilia INT
						  ,@byOrder      VARCHAR(10)									
						  ,@byOrderCampo VARCHAR(50)
						  ,@rucProveedor VARCHAR(25)
						  ,@fechaInicio DATETIME
						  ,@fechaFin DATETIME'

			SET @sql = 'SELECT ar.idArticulo
							  ,ar.descripcion
							  ,ar.codigo
							  ,ar.subfamilia
							  ,ar.tarifa
							  ,FORMAT(ar.fechaCaducidad, ''dd/MM/yyyy'') as fechaCaducidad 
							  ,ISNULL(CAST(ar.precioConIva as numeric(15,2)),0) as precioIva
						FROM Inventario.v_Articulo_Tarifa ar WITH (NOLOCK)
						WHERE ar.estado = 1 AND ar.idEntidad = @idEntidad '

			SELECT
				 @filtroFecha         = filtroFecha
				,@checkboxSubFamilia  = checkboxSubFamiliaFiltro ,@idSubFamilia = bySubFamilia
				,@checkboxStock       = checkboxStockFiltro      ,@byStock      = byStock
				,@chkProveedor        = chkProveedor             ,@rucProveedor = numeroIdentificacion
				,@checkBoxFecha       = ckFechaCaducidad         ,@fechaInicio  = fechaInicio ,@fechaFin = fechaFin
				,@byOrder             = byOrder			 
				,@byOrderCampo        = byOrderCampo		
			FROM OPENJSON(@json)
			WITH ( filtroFecha          VARCHAR(50) '$.filtroFecha'			
				  ,checkboxSubFamiliaFiltro     BIT '$.checkboxSubFamiliaFiltro',bySubFamilia                 INT '$.bySubFamilia'	
				  ,checkboxStockFiltro          BIT '$.checkboxStockFiltro'     ,byStock                      INT '$.byStock'	
				  ,chkProveedor                 BIT '$.chkProveedor'            ,numeroIdentificacion VARCHAR(25) '$.numeroIdentificacion'
				  ,chkUbicacion                 BIT '$.chkUbicacion'            ,idBodega                     INT '$.idBodega'            ,ubicacion VARCHAR(100) '$.ubicacion'
				  ,ckFechaCaducidad             BIT '$.ckFechaCaducidad'        ,fechaInicio             DATETIME '$.fechaInicio'         ,fechaFin      DATETIME '$.fechaFin'
				  ,byOrder              VARCHAR(10) '$.byOrder'
				  ,byOrderCampo         VARCHAR(50) '$.byOrderCampo'	
				) AS dt

			IF @chkProveedor = 1
				BEGIN
					SET @sql = @sql + 'AND ar.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucProveedor) '
				END

			IF @chkUbicacion = 1
				BEGIN
					SET @sql = @sql + 'AND ar.idArticulo IN (SELECT sa.idArticulo FROM v_Articulo_Stock sa WITH (NOLOCK) WHERE sa.idBodega = @idBodega AND sa.ubicacion LIKE ''%'' + @ubicacion + ''%'' ) '
				END 

			IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql + 'AND ar.caducidad = 1 AND CAST(ar.fechaCaducidad AS DATE) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
				END 

			IF @checkBoxSubFamilia = 1
				BEGIN
					SET @sql = @sql + 'AND ar.idSubFamilia = @bySubFamilia '
				END

			IF @checkBoxStock = 1 AND @byStock = 1 
				BEGIN			
					SET @sql = @sql + 'AND ar.stock > 0 '
				END 

			--Articulo sin Stock 
			IF  @checkBoxStock = 1 AND @byStock = 2 
				BEGIN			
					SET @sql = @sql + 'AND ar.stock <= 0 '
				END

			IF @byOrderCampo = 'ar.idSubFamilia'
				BEGIN
					SET @byOrderCampo = 'ar.idSubFamilia '
				END

			SET @sql = @sql + ' ORDER BY '+ @byOrderCampo+ ' ' +  @byOrder
		
			SELECT e.ruc
			      ,e.razonSocial 
			      ,e.nombreComercial	
			      ,ISNULL(e.telefono, '')telefonoEntidad
			      ,ISNULL(e.direccion, '')direccionEntidad
			      ,@filtroFecha as filtroFecha	
				  ,@checkBoxFecha as caducidad
			FROM dbo.Entidad e	WITH(NOLOCK)	
			WHERE e.idEntidad = @idEntidad


			EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad    = @idEntidad
							  ,@idSubFamilia = @idSubFamilia
							  ,@fechaInicio  = @fechaInicio
							  ,@fechaFin     = @fechaFin
							  ,@byOrder      = @byOrder
							  ,@byOrderCampo = @byOrderCampo
							  ,@rucProveedor = @rucProveedor

			RETURN 
		END 

	-- REPORTE DE ARTICULOS CON STOCK POR BODEGA -- 
	IF @tipo = 3
		BEGIN 
			
			SET @params = '@idEntidad    INT									
						  ,@idSubFamilia INT
						  ,@byOrder      VARCHAR(10)									
						  ,@byOrderCampo VARCHAR(50)
						  ,@rucProveedor VARCHAR(25)
						  ,@fechaInicio DATETIME
						  ,@fechaFin DATETIME'

			SET @sql = 'SELECT ar.idArticulo
							  ,ar.descripcion
							  ,ar.codigo
							  ,ar.subfamilia
							  ,CAST(ar.precioCosto AS NUMERIC(18,2)) as precioCosto
							  ,ar.idBodega
							  ,ar.bodega
							  ,ar.cantidad as stock
							  ,FORMAT(ar.fechaCaducidad, ''dd/MM/yyyy'') as fechaCaducidad 
							  ,CAST(ar.stock AS NUMERIC(18,2)) as stockTotal
							  ,CAST(ar.stock * ar.precioCosto as numeric(15, 2)) as totalInventario
						FROM Inventario.v_Articulo_Stock ar
						WHERE ar.estado = 1 AND ar.idEntidad = @idEntidad '	

			SELECT
				 @filtroFecha         = filtroFecha
				,@checkboxSubFamilia  = checkboxSubFamiliaFiltro ,@idSubFamilia = bySubFamilia
				,@checkboxStock       = checkboxStockFiltro      ,@byStock      = byStock
				,@chkProveedor        = chkProveedor             ,@rucProveedor = numeroIdentificacion
				,@checkBoxFecha       = ckFechaCaducidad         ,@fechaInicio  = fechaInicio ,@fechaFin = fechaFin
				,@byOrder             = byOrder			 
				,@byOrderCampo        = byOrderCampo		
			FROM OPENJSON(@json)
			WITH ( filtroFecha          VARCHAR(50) '$.filtroFecha'			
				  ,checkboxSubFamiliaFiltro     BIT '$.checkboxSubFamiliaFiltro',bySubFamilia                 INT '$.bySubFamilia'	
				  ,checkboxStockFiltro          BIT '$.checkboxStockFiltro'     ,byStock                      INT '$.byStock'	
				  ,chkProveedor                 BIT '$.chkProveedor'            ,numeroIdentificacion VARCHAR(25) '$.numeroIdentificacion'
				  ,chkUbicacion                 BIT '$.chkUbicacion'            ,idBodega                     INT '$.idBodega'            ,ubicacion VARCHAR(100) '$.ubicacion'
				  ,ckFechaCaducidad             BIT '$.ckFechaCaducidad'        ,fechaInicio             DATETIME '$.fechaInicio'         ,fechaFin      DATETIME '$.fechaFin'
				  ,byOrder              VARCHAR(10) '$.byOrder'
				  ,byOrderCampo         VARCHAR(50) '$.byOrderCampo'	
				) AS dt

			IF @chkProveedor = 1
				BEGIN
					SET @sql = @sql + ' AND ar.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucProveedor) '
				END

			IF @chkUbicacion = 1
				BEGIN
					SET @sql = @sql + 'AND ar.idArticulo IN (SELECT sa.idArticulo FROM v_Articulo_Stock sa WITH (NOLOCK) WHERE sa.idBodega = @idBodega AND sa.ubicacion LIKE ''%'' + @ubicacion + ''%'' ) '
				END 

			IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql + 'AND ar.caducidad = 1 AND CAST(ar.fechaCaducidad AS DATE) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
				END 

			IF @checkboxSubFamilia = 1
				BEGIN
					SET @sql = @sql + ' AND ar.idSubFamilia = @bySubFamilia '
				END
		
			--Articulo con stock
			IF @checkboxStock = 1 AND @byStock = 1
				BEGIN
					SET @sql = @sql + ' AND ar.stock > 0 '
				END

			--Articulo sin Stock 
			IF @checkboxStock = 1 AND @byStock = 2
				BEGIN
					SET @sql = @sql + ' AND ar.stock <= 0 '
				END

			IF @byOrderCampo = 'ar.idSubFamilia'
				BEGIN
					SET @byOrderCampo = 'ar.subfamilia'
				END

			SET @sql = @sql + ' ORDER BY ' + @byOrderCampo + ' ' + @byOrder

			SELECT e.ruc
				,e.razonSocial
				,e.nombreComercial
				,ISNULL(e.telefono, '') telefonoEntidad
				,ISNULL(e.direccion, '') direccionEntidad
				,@filtroFecha AS filtroFecha
			FROM dbo.Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad

			EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad    = @idEntidad
							  ,@idSubFamilia = @idSubFamilia
							  ,@fechaInicio  = @fechaInicio
							  ,@fechaFin     = @fechaFin
							  ,@byOrder      = @byOrder
							  ,@byOrderCampo = @byOrderCampo
							  ,@rucProveedor = @rucProveedor

			RETURN 
		END
	
	-- REPORTE DE CONSUMO DIARIO DE ARTICULOS
	IF @tipo = 4
		BEGIN 
			
			SET @params =  '@idArticulo INT
	                       ,@idUsuario INT
						   ,@fechaInicio DATETIME
						   ,@fechaFin DATETIME
						   ,@idEntidad INT
						   ,@codTransaccion VARCHAR(5)'

			SET @sql = 'SELECT tt.articulo
							  ,tt.codArticulo
							  ,cantidad                = CAST(tt.cantidad as numeric(18,2))
							  ,precioUnitario          = CAST(tt.precioUnitario as numeric(18,2))
							  ,precioTotalSinImpuestos = CASE WHEN tt.codTransaccion = ''S'' THEN CAST(tt.totalSalida as numeric(18,2)) 
															  WHEN tt.codTransaccion = ''E'' THEN CAST(tt.totalEntrada as numeric(18,2)) 
															  ELSE 0
														 END 
							  ,tarifa                  = CASE tt.codTransaccion WHEN ''S'' THEN tt.tarifa
																				WHEN ''E'' THEN ''COSTO''
																				ELSE ''''
														 END 
							  ,tt.clienteProveedor
							  ,fechaRegistro           = FORMAT(tt.fechaRegistro, ''dd/MM/yyyy HH:mm'')
							  ,tt.codDoc
							  ,serieComprobante = tt.nroDocumento
						FROM v_InventarioTransaccion tt
						WHERE tt.idEntidad = @idEntidad AND tt.estado = 1 '

			SELECT @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

			SELECT @checkBoxFecha       = checkBoxFecha
				  ,@checkBoxArticulo    = checkBoxArticulo
				  ,@checkBoxTransaccion = checkBoxTransaccion
				  ,@checkBoxUsuario     = checkBoxUsuario
				  ,@idArticulo          = idArticulo
				  ,@idUsuario           = idUsuario
				  ,@codTransaccion      = codTransaccion
				  ,@fechaFin            = fechaFin
				  ,@fechaInicio         = fechaInicio
			FROM OPENJSON(@json) WITH (
						 checkBoxArticulo      BIT '$.checkBoxArticulo'
						,checkBoxFecha         BIT '$.checkBoxFecha'
						,checkBoxTransaccion   BIT '$.checkBoxTransaccion'
						,checkBoxUsuario       BIT '$.checkBoxUsuario'
						,idArticulo            INT '$.idArticulo'
						,idUsuario             INT '$.idUsuario'
						,codTransaccion VARCHAR(5) '$.codTransaccion'
						,fechaInicio      DATETIME '$.fechaInicio'
						,fechaFin         DATETIME '$.fechaFin'
			    )

			SELECT TOP 1 @usuario = 'Usuario : ' + nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

			IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql + 'AND CAST(tt.fechaRegistro as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
				END

			IF @checkBoxArticulo = 1
				BEGIN
					SET @sql = @sql + 'AND tt.idArticulo = @idArticulo '
				END 

			IF @checkBoxTransaccion = 1
				BEGIN
					SET @sql = @sql + 'AND tt.codTransaccion = @codTransaccion '
				END 

			IF @checkBoxUsuario = 1
				BEGIN
					SET @sql = @sql + 'AND tt.idUsuario = @idUsuario '
				END

			SET @sql = @sql + 'ORDER BY tt.fechaRegistro ASC '

			--Entidad 
			SELECT e.ruc
				  ,e.razonSocial 
				  ,e.nombreComercial	
				  ,ISNULL(e.telefono, '')telefonoEntidad
				  ,ISNULL(e.direccion, '')direccionEntidad			
				  ,tituloReporte = 'CONSUMO POR ARTICULOS'
				  ,usuario       = @usuario
				  ,CONVERT(NVARCHAR,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy')) as filtroFecha			
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad 
			
			EXEC sp_executesql @sql
							  ,@params
							  ,@idArticulo     = @idArticulo
							  ,@idEntidad      = @idEntidad
							  ,@idUsuario      = @idUsuario
							  ,@codTransaccion = @codTransaccion
							  ,@fechaInicio    = @fechaInicio
							  ,@fechaFin       = @fechaFin

			RETURN 

		END 

	SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
	RETURN 
END
