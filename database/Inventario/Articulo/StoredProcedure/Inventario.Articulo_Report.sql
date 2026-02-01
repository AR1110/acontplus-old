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
--Inventario.Articulo_Report 28, '{"tipo":10,"idArticulo":5}'
CREATE OR ALTER PROCEDURE Inventario.Articulo_Report @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	--> Global
    DECLARE @tipo INT ,@idEntidad INT
    DECLARE @stockStatusCode VARCHAR(5)

    --> Sql
    DECLARE @params NVARCHAR(MAX),@sql NVARCHAR(MAX)

    --> Filters
    DECLARE @filtroFecha   VARCHAR(50)
	       ,@idSubFamilia          INT
	       ,@idArticulo            INT
	       ,@rucClienteProveedor  VARCHAR(25)
	       ,@idBodega              INT
           ,@ubicacion    VARCHAR(150)
	       ,@checkBoxFecha         BIT
           ,@fechaInicio      DATETIME
           ,@fechaFin         DATETIME
	       ,@idUsuario             INT
	       ,@codTransaccion VARCHAR(5)
	       ,@estado         VARCHAR(5)
	       ,@usuario      VARCHAR(150)
           ,@codEstab     VARCHAR(100)
           ,@idMarca              INT
           ,@idTarifa             INT
           ,@userRoleId           INT
           ,@idTipoIva            INT



	SELECT @tipo = tipo, @userRoleId = userRoleId FROM OPENJSON(@json) WITH (tipo INT, userRoleId INT)

	SELECT TOP 1  @idEntidad = idEntidad, @usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> Fraccionados
	IF @tipo = 1
		BEGIN

			SELECT @idArticulo         = idArticulo
				  ,@idSubFamilia       = bySubFamilia
				  ,@rucClienteProveedor  = numeroIdentificacion
			FROM OPENJSON(@json) WITH
            (    idArticulo INT
			    ,bySubFamilia                 INT
			    ,numeroIdentificacion VARCHAR(25)
			)

			SET @params = '@idEntidad INT
			              ,@idArticulo INT
						  ,@idSubFamilia INT
						  ,@rucClienteProveedor VARCHAR(150)'

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

			IF @rucClienteProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucClienteProveedor AND codTransaccion = ''E'') '
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
							   ,@rucClienteProveedor = @rucClienteProveedor
			RETURN
		END

	--> Lista de Precio
	IF @tipo = 2
		BEGIN
            DECLARE @ckFechaModificaccion BIT

            SELECT @idSubFamilia         = bySubFamilia
				  ,@rucClienteProveedor  = numeroIdentificacion
                  ,@stockStatusCode      = stockStatusCode
                  ,@idMarca              = idMarca
                  ,@idTarifa             = idTarifa
                  ,@ckFechaModificaccion = ckFechaModificaccion
                  ,@fechaInicio          = fechaInicio
                  ,@fechaFin             = fechaFin
			FROM OPENJSON(@json) WITH
            (
                bySubFamilia         INT
               ,numeroIdentificacion VARCHAR(25)
               ,stockStatusCode      VARCHAR(5)
               ,idMarca              INT
               ,idTarifa             INT
               ,ckFechaModificaccion BIT
               ,fechaInicio          DATETIME2
               ,fechaFin             DATETIME2

		    ) AS dt

			SET @params = '@idEntidad    INT
						  ,@idSubFamilia INT
                          ,@idMarca      INT
                          ,@idTarifa     INT
                          ,@fechaInicio  DATETIME2
						  ,@fechaFin     DATETIME2'

			SET @sql = 'SELECT ar.idArticulo
							  ,ar.descripcion
							  ,ar.codigo
							  ,ar.subfamilia
							  ,ar.tarifa
							  ,FORMAT(ar.fechaCaducidad, ''dd/MM/yyyy'')        as fechaCaducidad
							  ,ISNULL(CAST(ar.precioConIva as numeric(15,2)),0) as precioIva
                              ,ar.stock
						FROM Inventario.v_Articulo_Tarifa ar WITH (NOLOCK)
						WHERE ar.estado = 1
                          AND ar.idEntidad = @idEntidad '

			IF @ckFechaModificaccion = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(ar.UpdateAt as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date)'
                END

            IF @idSubFamilia > 0
				BEGIN
					SET @sql = @sql + 'AND ar.idSubFamilia = @idSubFamilia '
				END

            IF @idMarca > 0
                BEGIN
                    SET @sql = @sql + 'AND ar.idMarca  = @idMarca '
                END

            IF @idTarifa > 0
                BEGIN
                    SET @sql = @sql + 'AND ar.idTarifa  = @idTarifa '
                END

            IF @stockStatusCode IS NOT NULL
                --> con stock
                IF @stockStatusCode='CS'
                    BEGIN
                        SET @sql = @sql + 'AND ar.stock > 0 '
                    END

                --> sin stock
                 IF @stockStatusCode='SS'
                     BEGIN
                         SET @sql = @sql + 'AND ar.stock <= 0 '
                     END

                --> stock minimo
                IF @stockStatusCode='SM'
                    BEGIN
                        SET @sql = @sql + ' AND ar.stock <= ar.stockMinimo '
                    END

			SET @sql = @sql + ' ORDER BY ar.idArticulo '

			SELECT e.ruc
			      ,e.razonSocial
			      ,e.nombreComercial
			      ,ISNULL(e.telefono, '')  as telefonoEntidad
			      ,ISNULL(e.direccion, '') as direccionEntidad
			      ,@filtroFecha            as filtroFecha
				  ,@checkBoxFecha          as caducidad
			FROM dbo.Entidad e	WITH(NOLOCK)
			WHERE e.idEntidad = @idEntidad


			EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad    = @idEntidad
							  ,@idSubFamilia = @idSubFamilia
                              ,@idMarca      = @idMarca
                              ,@idTarifa     = @idTarifa
                              ,@fechaInicio  = @fechaInicio
                              ,@fechaFin     = @fechaFin

			RETURN
		END

	--> Stock por Bodega
	IF @tipo = 3
		BEGIN
            SELECT @idSubFamilia        = bySubFamilia
				  ,@rucClienteProveedor = numeroIdentificacion
                  ,@idBodega            = idBodega
                  ,@codEstab            = codEstab
                  ,@stockStatusCode     = stockStatusCode
                  ,@idMarca             = idMarca
                  ,@idTipoIva           = ISNULL(idTipoIva, 0)
			FROM OPENJSON(@json) WITH
            (
                 bySubFamilia            INT
			    ,numeroIdentificacion    VARCHAR(25)
                ,idBodega                INT
                ,codEstab                VARCHAR(50)
                ,stockStatusCode         VARCHAR(5)
                ,idMarca                 INT
                ,idTipoIva               INT
			) AS dt

			SET @params = '@idEntidad    INT
						  ,@idSubFamilia INT
						  ,@idBodega     INT
                          ,@codEstab     VARCHAR(50)
						  ,@rucClienteProveedor VARCHAR(25)
                          ,@idMarca      INT
                          ,@idTipoIva    INT'

			SET @sql = 'SELECT  
							  ar.idArticulo
							, ar.descripcion
							, ar.codigo
							, ar.subfamilia
							, CAST(ar.precioCosto AS NUMERIC(18,2)) AS precioCosto
							, ar.idBodega
							, ar.bodega
							, CAST(ar.cantidad AS NUMERIC(15,2)) AS stock
							, FORMAT(ar.fechaCaducidad, ''dd/MM/yyyy'') AS fechaCaducidad

							-- Stock total por artículo
							, CAST(
								SUM(ar.cantidad) OVER(PARTITION BY ar.idArticulo)
							  AS NUMERIC(15,2)) AS stockTotal

							-- Total inventario correcto
							, CAST(
								SUM(ar.cantidad) OVER(PARTITION BY ar.idArticulo)
								* MAX(ar.precioCosto) OVER(PARTITION BY ar.idArticulo)
							  AS NUMERIC(15,2)) AS totalInventario

							, ar.idEstablecimiento
							, ar.nombreComercial
							, ar.marca
							, ar.stockMinimo
							, ar.medida

						FROM Inventario.v_Articulo_Stock ar
						INNER JOIN dbo.TipoIva ti WITH (NOLOCK) 
							ON ti.idTipoIva = ar.idTipoIva

						WHERE ar.estado = 1
						  AND ar.idEntidad = @idEntidad '

			IF @rucClienteProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND ar.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucClienteProveedor) '
				END

			IF @idSubFamilia > 0
				BEGIN
					SET @sql = @sql + 'AND ar.idSubFamilia = @idSubFamilia '
				END

            IF @idBodega > 0
                BEGIN
                    SET @sql = @sql + 'AND ar.idBodega = @idBodega '
                END

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND ar.codEstab = @codEstab '
                END


            IF @idMarca > 0
                BEGIN
                    SET @sql = @sql + 'AND ar.idMarca  = @idMarca '
                END

            IF @idTipoIva > 0
                BEGIN
                    SET @sql = @sql + 'AND ti.idTipoIva  = @idTipoIva '
                END

            IF @stockStatusCode IS NOT NULL
                --con stock
                IF @stockStatusCode='CS'
                    BEGIN
                        SET @sql = @sql + 'AND ar.stock > 0 '
                    END
                --sin stock
                 IF @stockStatusCode='SS'
                     BEGIN
                         SET @sql = @sql + 'AND ar.stock <= 0 '
                     END
                --stock minimo
                IF @stockStatusCode='SM'
                 BEGIN
                     SET @sql = @sql + ' AND ar.stock <= ar.stockMinimo '
                 END


			SET @sql = @sql + ' ORDER BY ar.descripcion '

			SELECT e.ruc
				,e.razonSocial
				,e.nombreComercial
				,ISNULL(e.telefono, '')  as telefonoEntidad
				,ISNULL(e.direccion, '') as direccionEntidad
				,@filtroFecha            as filtroFecha
                ,'Reporte Stock'         as title
                ,@stockStatusCode        as stockStatusCode
			FROM dbo.Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad

			EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad    = @idEntidad
							  ,@idSubFamilia = @idSubFamilia
							  ,@idBodega     = @idBodega
							  ,@rucClienteProveedor = @rucClienteProveedor
                              ,@codEstab     = @codEstab
                              ,@idMarca      = @idMarca
                              ,@idTipoIva    = @idTipoIva

			RETURN
		END

	--> Consumo Diario
	IF @tipo = 4
		BEGIN
            DECLARE @viewCostPrice BIT
                   ,@checkboxPrecioCostoFiltro BIT
                   ,@tiposDocSelected VARCHAR(250)
                    ,@timePicker BIT

			SET @params =  '@idArticulo          INT
	                       ,@idUsuario           INT
                           ,@codEstab            VARCHAR(100)
                           ,@idBodega            INT
                           ,@idSubFamilia        INT
						   ,@fechaInicio         DATETIME2
						   ,@fechaFin            DATETIME2
						   ,@idEntidad           INT
						   ,@codTransaccion      VARCHAR(5)
                           ,@rucClienteProveedor VARCHAR(20)
                           ,@viewCostPrice       BIT
                           ,@tiposDocSelected    VARCHAR(250) '

			SET @sql = 'SELECT tt.articulo
							  ,tt.codArticulo
							  ,cantidad                = CAST(tt.cantidad as numeric(18,2))
							  ,precioUnitario          = CAST(tt.precioUnitario as numeric(18,2))
							  ,precioCosto             = CAST(IIF(@viewCostPrice = 0,0,tt.precioCostoFraccionado) as numeric(18,2))
                           --   ,valorImpuesto           = CAST(ISNULL(tt.valorImpuesto,0) as numeric(18,2))
							  ,precioTotalSinImpuestos = CASE WHEN tt.codTransaccion = ''S'' THEN CAST(tt.totalSalida as numeric(18,2))
															  WHEN tt.codTransaccion = ''E'' THEN CAST(tt.totalEntrada as numeric(18,2))
															  ELSE 0
														 END
							  ,tarifa                  = CASE tt.codTransaccion WHEN ''S'' THEN tt.tarifa
																				WHEN ''E'' THEN ''COSTO''
																				ELSE ''''
														 END
							  ,tt.clienteProveedor
                              ,tt.rucClienteProveedor
							  ,fechaRegistro           = FORMAT(tt.fechaRegistro, ''dd/MM/yyyy HH:mm'')
							  ,tt.codDoc
							  ,serieComprobante = tt.nroDocumento
                              ,tt.usuario
                              ,tt.bodega
                              ,tt.medida as medidaSalida
                              ,tt.subFamilia
						FROM v_InventarioTransaccion tt WITH (NOLOCK)
						WHERE tt.idEntidad = @idEntidad
                          AND tt.codTransaccion = ''S''
                          AND tt.estado = 1  '

			SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

            SELECT TOP 1 @viewCostPrice = precio FROM Config.v_User_Permission_Product WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

			SELECT @checkBoxFecha             = checkBoxFecha
				  ,@checkboxPrecioCostoFiltro = checkboxPrecioCostoFiltro
                  ,@idArticulo                = idArticulo
				  ,@idUsuario                 = idUsuario
                  ,@idSubFamilia              = idSubFamilia
				  ,@codTransaccion            = codTransaccion
				  ,@fechaFin                  = fechaFin
				  ,@fechaInicio               = fechaInicio
                  ,@idBodega                  = idBodega
                  ,@codEstab                  = codEstab
                  ,@rucClienteProveedor       = numeroIdentificacion
			      ,@tiposDocSelected          = tiposDocSelected
                  ,@timePicker                = timePicker
			FROM OPENJSON(@json) WITH
			(
				checkBoxArticulo          BIT
		       ,checkboxPrecioCostoFiltro BIT
               ,checkBoxFecha             BIT
		       ,idArticulo                INT
		       ,idUsuario                 INT
               ,idSubFamilia              INT
		       ,codTransaccion            VARCHAR(5)
		       ,fechaInicio               DATETIME2
		       ,fechaFin                  DATETIME2
               ,idBodega                  INT
               ,codEstab                  VARCHAR(100)
               ,idCliente                 INT
               ,numeroIdentificacion      VARCHAR(25)
               ,tiposDocSelected          VARCHAR(250)
               ,timePicker                BIT
			)


			SELECT TOP 1 @usuario = 'Usuario : ' + nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

            IF @tiposDocSelected IS NOT NULL
			BEGIN
			    SET @sql = @sql + 'AND tt.idTipoDocumento IN (SELECT value FROM STRING_SPLIT(@tiposDocSelected, '','')) '
			END

             IF @checkBoxFecha = 1
			    BEGIN
				    SET @sql = @sql + '
					    AND CAST(tt.fechaRegistro AS date)
						    BETWEEN CAST(@fechaInicio AS date)
						    AND CAST(@fechaFin AS date)
				    '

				    IF @timePicker = 1
				    BEGIN
					    SET @sql = @sql + '
						    AND CAST(tt.fechaRegistro AS time)
							    BETWEEN CAST(@fechaInicio AS time)
							    AND CAST(@fechaFin AS time)
					    '

					    /*
					    -- Opción B: Si necesitas manejar rangos que cruzan medianoche,
					    -- usa este bloque en lugar del anterior:
					    SET @sql = @sql + '
						    AND (
							       (CAST(tt.fechaRegistro AS time) >= CAST(@fechaInicio AS time)
								    AND CAST(tt.fechaRegistro AS time) <= ''23:59:59.9999999'')
							    OR (CAST(tt.fechaRegistro AS time) >= ''00:00:00''
								    AND CAST(tt.fechaRegistro AS time) <= CAST(@fechaFin AS time))
							    )
					    '
					    */
				    END
			    END



			IF @idArticulo > 0
				BEGIN
					SET @sql = @sql + 'AND tt.idArticulo = @idArticulo '
				END


            IF @idSubFamilia > 0
                BEGIN
                    SET @sql = @sql + 'AND tt.idSubFamilia = @idSubFamilia '
                END

			IF @idUsuario > 0
				BEGIN
					SET @sql = @sql + 'AND tt.idUsuario = @idUsuario '
				END

             IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND tt.codEstab = @codEstab '
                END

            IF @idBodega > 0
                BEGIN
                    SET @sql = @sql + 'AND tt.idBodega = @idBodega '
                END

            IF @rucClienteProveedor IS NOT NULL
                BEGIN
                    SET @sql = @sql + ' AND tt.rucClienteProveedor = @rucClienteProveedor '
                END



			SET @sql = @sql + 'ORDER BY tt.articulo,tt.fechaRegistro ASC '

			--Entidad
			SELECT e.ruc
				  ,e.razonSocial
				  ,e.nombreComercial
				  ,ISNULL(e.telefono, '')                                                        as telefonoEntidad
				  ,ISNULL(e.direccion, '')                                                       as direccionEntidad
				  ,'CONSUMO POR ARTICULOS'                                                       as nombreReporte
				  ,@usuario                                                                      as usuario
				  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy') as filtroFecha
                  ,@checkboxPrecioCostoFiltro                                                    as checkboxPrecioCostoFiltro
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad

			EXEC sp_executesql @sql
							  ,@params
							  ,@idArticulo          = @idArticulo
                              ,@codEstab            = @codEstab
                              ,@idBodega            = @idBodega
							  ,@idEntidad           = @idEntidad
							  ,@idUsuario           = @idUsuario
                              ,@idSubFamilia        = @idSubFamilia
							  ,@codTransaccion      = @codTransaccion
							  ,@fechaInicio         = @fechaInicio
							  ,@fechaFin            = @fechaFin
                              ,@rucClienteProveedor = @rucClienteProveedor
                              ,@viewCostPrice       = @viewCostPrice
			                  ,@tiposDocSelected    = @tiposDocSelected

			RETURN

		END

	--> Caducidad
	IF @tipo = 5
		BEGIN

			SET @params =  '@idEntidad INT
			               ,@rucClienteProveedor VARCHAR(20)
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
				  ,@rucClienteProveedor = numeroIdentificacion
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
				 ,fechaInicio             DATETIME2 '$.fechaInicio'
				 ,fechaFin                DATETIME2 '$.fechaFin'
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

			IF @rucClienteProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND st.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucClienteProveedor) '
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
				  ,tituloReporte = CASE @estado WHEN 'PA' THEN 'ARTICULOS QUE DE 1 A 5 D�AS CADUCAN '
				                                WHEN 'VI' THEN 'ARTICULO VIGENTES'
				                                          ELSE 'CADUCIDAD DE ART�CULOS' END
				  ,usuario       = @usuario
				  ,CONVERT(NVARCHAR,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy')) as filtroFecha
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad

			EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad    = @idEntidad
							  ,@rucClienteProveedor = @rucClienteProveedor
							  ,@idSubFamilia = @idSubFamilia
							  ,@fechaInicio  = @fechaInicio
							  ,@fechaFin     = @fechaFin
							  ,@idBodega     = @idBodega
							  ,@ubicacion    = @ubicacion
			RETURN
		END

    --> Rentabilidad (calculo de porcentaje utilidad, ganancia)
    IF @tipo = 6
        BEGIN

             SELECT @idSubFamilia        = bySubFamilia
				   ,@rucClienteProveedor = numeroIdentificacion
                   ,@idBodega            = idBodega
                   ,@codEstab            = codEstab
                   ,@stockStatusCode     = stockStatusCode
                   ,@idMarca             = idMarca
                   ,@idTarifa            = idTarifa
                   ,@idTipoIva          = idTipoIva
			FROM OPENJSON(@json) WITH
            (
                 bySubFamilia         INT
			    ,numeroIdentificacion VARCHAR(25)
                ,idBodega             INT
                ,codEstab             VARCHAR(50)
                ,stockStatusCode      VARCHAR(5)
                ,idMarca              INT
                ,idTarifa             INT
                ,idTipoIva            INT

			) AS dt

			SET @params = '@idEntidad    INT
						  ,@idSubFamilia INT
						  ,@rucClienteProveedor VARCHAR(25)
                          ,@idTarifa INT
                          ,@idBodega INT
						  ,@idMarca      INT
                          ,@codEstab VARCHAR(150)
                          ,@idTipoIva INT'

            SET @sql = 'SELECT ar.idArticulo
							  ,ar.descripcion
							  ,ar.codigo
							  ,ar.subfamilia
							  ,CAST(ar.precioCosto AS NUMERIC(18,2)) as precioCosto
							  ,ar.idBodega
							  ,ar.bodega
                              ,tarifaNom = ta.descripcion
                              ,pvp.precioVenta
							  ,CAST(ar.cantidad as numeric(15, 2)) as stock
							  ,CAST(SUM(ar.cantidad) OVER(PARTITION BY ar.idArticulo) as numeric(15, 2)) as stockTotal
							  ,CAST(SUM(ar.cantidad) OVER(PARTITION BY ar.idArticulo) * ar.precioCosto as numeric(15, 2)) as totalInventario
                              ,ar.idEstablecimiento
                              ,ar.nombreComercial
                              ,ar.marca
                              ,ar.stockMinimo
                              ,ar.medida
						FROM Inventario.v_Articulo_Stock ar
                        INNER JOIN dbo.ArticuloPvP pvp WITH (NOLOCK) ON pvp.idArticulo = ar.idArticulo
                        INNER JOIN dbo.Tarifa     ta WITH (NOLOCK)  ON ta.idTarifa     = pvp.idTarifa
                        INNER JOIN dbo.TipoIva   ti WITH (NOLOCK)  ON ti.idTipoIva   = ar.idTipoIva
						WHERE ar.idEntidad = @idEntidad AND ar.estado = 1 AND pvp.idTarifa = @idTarifa '




            IF @rucClienteProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND ar.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucClienteProveedor) '
				END

			IF @idSubFamilia > 0
				BEGIN
					SET @sql = @sql + ' AND ar.idSubFamilia = @idSubFamilia '
				END

            IF @idBodega > 0
                BEGIN
                    SET @sql = @sql + 'AND ar.idBodega = @idBodega '
                END

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND ar.codEstab = @codEstab '
                END

            IF @idTipoIva > 0
                BEGIN
                    SET @sql = @sql + 'AND ti.idTipoIva  = @idTipoIva '
                END

            IF @stockStatusCode IS NOT NULL
                --con stock
                IF @stockStatusCode='CS'
                    BEGIN
                        SET @sql = @sql + 'AND ar.stock > 0 '
                    END
                --sin stock
                    IF @stockStatusCode='SS'
                        BEGIN
                            SET @sql = @sql + 'AND ar.stock <= 0 '
                        END
                --stock minimo
                IF @stockStatusCode='SM'
                    BEGIN
                        SET @sql = @sql + ' AND ar.stock <= ar.stockMinimo '
                    END


			SET @sql = @sql + '  ORDER BY ar.idArticulo,ta.codigo ASC '

            SELECT e.ruc
				  ,e.razonSocial
				  ,e.nombreComercial
				  ,ISNULL(e.telefono, '')telEntidad
				  ,ISNULL(e.direccion, '')dirEntidad
				  ,tituloReporte = 'ARTICULOS STOCK RENTABILIDAD'
				  ,usuario       = @usuario
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad

            EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad           = @idEntidad
							  ,@idSubFamilia        = @idSubFamilia
							  ,@rucClienteProveedor = @rucClienteProveedor
                              ,@idTarifa            = @idTarifa
                              ,@idMarca             = @idMarca
                              ,@idBodega            = @idBodega
                              ,@codEstab            = @codEstab
                              ,@idTipoIva           = @idTipoIva
            RETURN
        END

	SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
	RETURN
END
