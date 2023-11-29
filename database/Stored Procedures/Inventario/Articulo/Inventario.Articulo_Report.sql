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
CREATE OR ALTER PROCEDURE Inventario.Articulo_Report @idRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	--> Global
    DECLARE @tipo INT ,@idEntidad INT 
	
    --> Sql
    DECLARE @params NVARCHAR(MAX),@sql NVARCHAR(MAX)

    --> Filters
    DECLARE @filtroFecha   VARCHAR(50)
	       ,@idSubFamilia          INT
	       ,@byStock               INT
	       ,@idArticulo            INT
	       ,@rucProveedor  VARCHAR(25)
	       ,@idBodega              INT 
           ,@ubicacion    VARCHAR(150)
	       ,@checkBoxFecha         BIT 
           ,@fechaInicio      DATETIME 
           ,@fechaFin         DATETIME
	       ,@idUsuario             INT
	       ,@codTransaccion VARCHAR(5)
	       ,@estado         VARCHAR(5)
	       ,@byOrder      NVARCHAR(10)			
	       ,@byOrderCampo NVARCHAR(50)
	       ,@usuario      VARCHAR(150)

	SELECT TOP 1  @idEntidad = idEntidad, @usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)
	
	--> Fraccionados
	IF @tipo = 1
		BEGIN
			
			SELECT @idArticulo         = idArticulo 
				  ,@idSubFamilia       = bySubFamilia           
				  ,@rucProveedor       = numeroIdentificacion
			FROM OPENJSON(@json) 
			WITH (idArticulo                   INT '$.idArticulo'
				 ,bySubFamilia                 INT '$.bySubFamilia'
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
			
			IF @idArticulo > 0 
				BEGIN
					SET @sql = @sql + 'AND idArticulo = @idArticulo '
				END 

			IF @idSubFamilia > 0
				BEGIN
					SET @sql = @sql + 'AND idSubFamilia = @idSubFamilia '
				END

			IF @rucProveedor IS NOT NULL
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

	--> Lista de Precio
	IF @tipo = 2
		BEGIN
			
			SET @params = '@idEntidad    INT									
						  ,@idSubFamilia INT
						  ,@byOrder      VARCHAR(10)									
						  ,@byOrderCampo VARCHAR(50)
						  ,@rucProveedor VARCHAR(25)'

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
				 @filtroFecha   = filtroFecha
				,@idSubFamilia  = bySubFamilia
				,@byStock       = byStock
				,@rucProveedor  = numeroIdentificacion
				,@byOrder       = byOrder			 
				,@byOrderCampo  = byOrderCampo		
			FROM OPENJSON(@json)
			WITH ( filtroFecha          VARCHAR(50) '$.filtroFecha'			
				  ,bySubFamilia                 INT '$.bySubFamilia'	
				  ,byStock                      INT '$.byStock'	
				  ,chkProveedor                 BIT '$.chkProveedor'            ,numeroIdentificacion VARCHAR(25) '$.numeroIdentificacion'
				  ,byOrder              VARCHAR(10) '$.byOrder'
				  ,byOrderCampo         VARCHAR(50) '$.byOrderCampo'	
				) AS dt

			IF @rucProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND ar.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucProveedor) '
				END

			IF @idSubFamilia > 0
				BEGIN
					SET @sql = @sql + 'AND ar.idSubFamilia = @idSubFamilia '
				END

			IF @byStock = 1 
				BEGIN			
					SET @sql = @sql + 'AND ar.stock > 0 '
				END 

			--Articulo sin Stock 
			IF @byStock = 2 
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
							  ,@byOrder      = @byOrder
							  ,@byOrderCampo = @byOrderCampo
							  ,@rucProveedor = @rucProveedor

			RETURN 
		END 

	--> Stock por Bodega
	IF @tipo = 3
		BEGIN 
			
			SET @params = '@idEntidad    INT									
						  ,@idSubFamilia INT
						  ,@idBodega     INT
						  ,@byOrder      VARCHAR(10)									
						  ,@byOrderCampo VARCHAR(50)
						  ,@rucProveedor VARCHAR(25)
						  ,@fechaInicio  DATETIME
						  ,@fechaFin     DATETIME
						  ,@ubicacion    VARCHAR(300)'

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
				 @filtroFecha  = filtroFecha
				,@idSubFamilia = bySubFamilia
				,@byStock      = byStock
				,@rucProveedor = numeroIdentificacion
				,@byOrder      = byOrder			 
				,@byOrderCampo = byOrderCampo		
			FROM OPENJSON(@json)
			WITH ( filtroFecha          VARCHAR(50) '$.filtroFecha'			
				  ,bySubFamilia                 INT '$.bySubFamilia'	
				  ,byStock                      INT '$.byStock'	
				  ,numeroIdentificacion VARCHAR(25) '$.numeroIdentificacion'
				  ,byOrder              VARCHAR(10) '$.byOrder'
				  ,byOrderCampo         VARCHAR(50) '$.byOrderCampo'	
				) AS dt

			IF @rucProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND ar.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucProveedor) '
				END

			IF @idSubFamilia > 0
				BEGIN
					SET @sql = @sql + ' AND ar.idSubFamilia = @idSubFamilia '
				END
		
			--Articulo con stock
			IF @byStock = 1
				BEGIN
					SET @sql = @sql + ' AND ar.stock > 0 '
				END

			--Articulo sin Stock 
			IF @byStock = 2
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
							  ,@idBodega     = @idBodega
							  ,@fechaInicio  = @fechaInicio
							  ,@fechaFin     = @fechaFin
							  ,@byOrder      = @byOrder
							  ,@byOrderCampo = @byOrderCampo
							  ,@rucProveedor = @rucProveedor
							  ,@ubicacion    = @ubicacion

			RETURN 
		END
	
	--> Consumo Diario
	IF @tipo = 4
		BEGIN 
			
			SET @params =  '@idArticulo INT
	                       ,@idUsuario INT
                           ,@idBodega INT
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
						FROM v_InventarioTransaccion tt WITH (NOLOCK)
						WHERE tt.idEntidad = @idEntidad AND tt.estado = 1 '

			SELECT @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

			SELECT @checkBoxFecha       = checkBoxFecha
				  ,@idArticulo          = idArticulo
				  ,@idUsuario           = idUsuario
				  ,@codTransaccion      = codTransaccion
				  ,@fechaFin            = fechaFin
				  ,@fechaInicio         = fechaInicio
                  ,@idBodega            = idBodega
			FROM OPENJSON(@json) WITH 
				(
				 checkBoxArticulo      BIT '$.checkBoxArticulo'
				,checkBoxFecha         BIT '$.checkBoxFecha'
				,idArticulo            INT '$.idArticulo'
				,idUsuario             INT '$.idUsuario'
				,codTransaccion VARCHAR(5) '$.codTransaccion'
				,fechaInicio      DATETIME '$.fechaInicio'
				,fechaFin         DATETIME '$.fechaFin'
                ,idBodega              INT '$.idBodega' 
				)

			SELECT TOP 1 @usuario = 'Usuario : ' + nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

			IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql + 'AND CAST(tt.fechaRegistro as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
				END

			IF @idArticulo > 0
				BEGIN
					SET @sql = @sql + 'AND tt.idArticulo = @idArticulo '
				END 

			IF @codTransaccion IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND tt.codTransaccion = @codTransaccion '
				END 

			IF @idUsuario > 0 
				BEGIN
					SET @sql = @sql + 'AND tt.idUsuario = @idUsuario '
				END

            IF @idBodega > 0 
                BEGIN
                    SET @sql = @sql + 'AND tt.idBodega = @idBodega '
                END 

			SET @sql = @sql + 'ORDER BY tt.articulo,tt.fechaRegistro ASC '

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
                              ,@idBodega       = @idBodega
							  ,@idEntidad      = @idEntidad
							  ,@idUsuario      = @idUsuario
							  ,@codTransaccion = @codTransaccion
							  ,@fechaInicio    = @fechaInicio
							  ,@fechaFin       = @fechaFin

			RETURN 

		END 
	
	--> Caducidad
	IF @tipo = 5
		BEGIN
			
			SET @params =  '@idEntidad INT
			               ,@rucProveedor VARCHAR(20)
						   ,@idSubFamilia INT
						   ,@fechaInicio DATETIME 
						   ,@fechaFin DATETIME
						   ,@idBodega INT
						   ,@ubicacion VARCHAR(400)'

			SET @sql = 'SELECT descripcion as articulo
							  ,st.codigo
							  ,st.subfamilia
							  ,CAST(st.precioCosto as numeric(18,2)) as precioCosto
							  ,FORMAT(st.fechaCaducidad, ''dd/MM/yyyy'') as fechaCaducidad
							  ,''Ubicacion: ''+ ISNULL(st.ubicacion,''NA'') + '' || Stock: '' + CAST(CAST( st.cantidad as numeric(18,2)) AS varchar) as ubicacion
							  ,st.bodega
							  ,(st.diasCaducidad * IIF(st.diasCaducidad < 0,-1,1) ) as diasCaducidad
							  ,CASE WHEN st.diasCaducidad <= 0 THEN ''Caducado''
							        WHEN st.diasCaducidad BETWEEN 1 AND 5 THEN ''Proximo a Caducar''
									ELSE ''Vigente'' 
							   END  as estado
						FROM Inventario.v_Articulo_Stock st 
						WHERE st.idEntidad = @idEntidad 
						  AND st.caducidad = 1 '

			SELECT @estado             = estado
				  ,@rucProveedor       = numeroIdentificacion
				  ,@idSubFamilia       = bySubFamilia
				  ,@checkBoxFecha      = checkBoxFecha
				  ,@fechaInicio        = fechaInicio
				  ,@fechaFin           = fechaFin
				  ,@idBodega           = idBodega
				  ,@ubicacion          = REPLACE(ubicacion,space(1),'%')
			FROM OPENJSON(@json) WITH 
				(    
			      estado                VARCHAR(5) '$.estado'
				 ,numeroIdentificacion VARCHAR(25) '$.numeroIdentificacion'
				 ,bySubFamilia                 INT '$.bySubFamilia'	
				 ,checkBoxFecha                BIT '$.ckFechaCaducidad'
				 ,fechaInicio             DATETIME '$.fechaInicio'
				 ,fechaFin                DATETIME '$.fechaFin'
				 ,idBodega                     INT '$.idBodega'
				 ,ubicacion           VARCHAR(400) '$.ubicacion'
				)

			
			IF @estado IS NOT NULL
				BEGIN
					IF @estado = 'PA'
						BEGIN
							SET @sql = @sql + 'AND st.diasCaducidad BETWEEN 1 AND 5 '
						END
						
					IF @estado = 'VI'
						BEGIN
							SET @sql = @sql + 'AND st.diasCaducidad >= 6 '
						END 

					IF @estado = 'CA'
						BEGIN
							SET @sql = @sql + 'AND st.diasCaducidad <= 0 '
						END 
				END 

			IF @rucProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND st.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucProveedor) '
				END 

			IF @idSubFamilia > 0
				BEGIN
					SET @sql = @sql + 'AND st.idSubFamilia = @idSubFamilia '
				END 
			
			IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql + 'AND CAST(st.fechaCaducidad as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
				END 

			IF @idBodega > 0
				BEGIN
					SET @sql = @sql + 'AND st.idBodega = @idBodega AND st.ubicacion LIKE ''%'' + @ubicacion + ''%'' '
				END 

			SET @sql = @sql + 'ORDER BY st.fechaCaducidad ASC'

			SELECT e.ruc
				  ,e.razonSocial 
				  ,e.nombreComercial	
				  ,ISNULL(e.telefono, '')telefonoEntidad
				  ,ISNULL(e.direccion, '')direccionEntidad			
				  ,tituloReporte = CASE @estado WHEN 'PA' THEN 'ARTICULOS QUE DE 1 A 5 DÍAS CADUCAN ' 
				                                WHEN 'VI' THEN 'ARTICULO VIGENTES'
				                                          ELSE 'CADUCIDAD DE ARTÍCULOS' END 
				  ,usuario       = @usuario
				  ,CONVERT(NVARCHAR,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy')) as filtroFecha			
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad

			EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad    = @idEntidad
							  ,@rucProveedor = @rucProveedor
							  ,@idSubFamilia = @idSubFamilia
							  ,@fechaInicio  = @fechaInicio
							  ,@fechaFin     = @fechaFin
							  ,@idBodega     = @idBodega
							  ,@ubicacion    = @ubicacion
			RETURN
		END 
    
    --> Kardex 
    IF @tipo = 6
        BEGIN
            RETURN 
        END 
	SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
	RETURN 
END
