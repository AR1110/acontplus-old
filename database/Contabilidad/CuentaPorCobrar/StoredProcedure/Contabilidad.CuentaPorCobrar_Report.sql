USE [Acontplus]
go 
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.CuentaPorCobrar_Report  @json VARCHAR(MAX),@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    
    SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@usuario VARCHAR(150) ,@idUsuario INT ,@nombreReporte VARCHAR(300),  @userRoleId INT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    --> Filters
    DECLARE @idCliente          INT 
           ,@codEstab           VARCHAR(25) 
           ,@fechaInicio        DATETIME2 
           ,@fechaFin           DATETIME2 
           ,@ckFecha            BIT 
           ,@codEstado          VARCHAR(15)  
           ,@ckCxcVencida       BIT
           ,@codDoc             VARCHAR(10) 
           ,@idPuntoEmision     INT 
           ,@ckCuotas           BIT 
           ,@idArticulo         INT 
           ,@idBodega           INT 
           ,@porcentajeRenta    NUMERIC(18,5) 
           ,@porcentajeComision NUMERIC(18,5)
           ,@subFamiliasChecked VARCHAR(150) 
           ,@idTarifa           INT
           ,@idTipoIva          INT
           ,@idEmpresa          INT
           ,@convertToDoc       BIT
           ,@id                 INT
           ,@idCiudad           INT 
           ,@dirViviendaCliente VARCHAR(150)
           ,@iva AS VARCHAR(50) = ''

    --> Variables
    SELECT @tipo = tipo, @userRoleId = userRoleId FROM OPENJSON(@json) WITH (tipo INT, userRoleId INT)

    SELECT TOP 1 @idEntidad = idEntidad ,@usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> Cartera Cliente
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'headerDs,detalleDs'

            SET @nombreReporte = 'Cartera de Cliente'

            SELECT @idCliente          = idCliente  
                  ,@ckFecha            = ckFecha
                  ,@fechaInicio        = fechaInicio
                  ,@fechaFin           = fechaFin
                  ,@codEstab           = codEstab
                  ,@codEstado          = codEstado
                  ,@ckCxcVencida       = ckCxcVencida
                  ,@ckCuotas           = ckCuotas
                  ,@codDoc             = codDoc
                  ,@idEmpresa          = idEmpresa
                  ,@convertToDoc       = convertToDoc
                  ,@dirViviendaCliente = dirViviendaCliente
                  ,@idCiudad = idCiudad
                  ,@idUsuario = userId
            FROM OPENJSON(@json) WITH 
            (
                idCliente          INT         '$.idCliente'
               ,ckFecha            BIT         '$.ckFecha'
               ,fechaInicio        DATETIME2   '$.fechaInicio'
               ,fechaFin           DATETIME2   '$.fechaFin'
               ,codEstab           VARCHAR(25) '$.codEstab'
               ,codEstado          VARCHAR(15) '$.codEstado'
               ,ckCxcVencida       BIT         '$.ckCxcVencida'
               ,ckCuotas           BIT         '$.ckCuotas'
               ,codDoc             VARCHAR(10) '$.codDoc'
               ,idEmpresa          INT         '$.idEmpresa'
               ,dirViviendaCliente VARCHAR(150) 
               ,idCiudad           INT
               ,userId             INT
               ,convertToDoc       BIT
            )

            SET @sql = 'SELECT IIF(cc.codDoc = ''01'',''FE'',cc.codDoc)  as codDoc
                              ,razonSocialComprador
                              ,serieComprobante
                              ,FORMAT(cc.fechaEmision,''dd/MM/yyyy'')     as fechaEmision
                              ,FORMAT(cc.fechaVencimiento,''dd/MM/yyyy'') as fechaVencimiento
                              ,CAST(importeTotal as numeric(18,2))        as importeTotal
                              ,CAST(mora as numeric(18,2))                as mora
                              ,CAST(abono as numeric(18,2))               as abono
                              ,CAST(saldo as numeric(18,2))               as saldo
                              ,estado 
                              ,cc.convertToDoc
                        FROM v_CuentaPorCobrar cc WITH (NOLOCK)
                        WHERE cc.idEntidad = @idEntidad '

            SET @params = '@idCliente    INT
                          ,@codEstab     VARCHAR(25)
                          ,@fechaInicio  DATETIME
                          ,@fechaFin     DATETIME
                          ,@codEstado    VARCHAR(15)
                          ,@codDoc       VARCHAR(10)
                          ,@idEmpresa    INT
                          ,@idEntidad    INT
                          ,@idCiudad     INT 
                          ,@idUsuario    INT
                          ,@convertToDoc BIT '
                          


            IF @ckCuotas = 1
                BEGIN
                    SET @sql = 'SELECT cc.idCuentaPorCobrar
                                      ,IIF(cc.codDoc = ''01'',''FE'',cc.codDoc)   as codDoc
                                      ,cc.razonSocialComprador
                                      ,cc.serieComprobante
                                      ,FORMAT(cc.fechaEmision,''dd/MM/yyyy'')     as fechaEmision
                                      ,FORMAT(cc.fechaVencimiento,''dd/MM/yyyy'') as fechaVencimiento
                                      ,CAST(cc.importeTotal as numeric(18,2))     as importeTotal
                                      ,CAST(cc.mora as numeric(18,2))             as mora
                                      ,CAST(cc.abono as numeric(18,2))            as abono
                                      ,CAST(cc.saldo as numeric(18,2))            as saldo
                                      ,cc.estado 
                                      ,cp.idCuotaPorCobrar
		                              ,cp.nroCuota
		                              ,CAST(cp.cuota as numeric(8,2))              as cuota
		                              ,CAST(cp.mora as numeric(8,2))               as moraCuota
		                              ,FORMAT(cp.fechaVencimiento,''dd/MM/yyyy'')  as fechaVencimientoCuota
                                      ,DATEDIFF(DAY,cp.fechaVencimiento,GETDATE()) as diasMora
		                              ,CAST(cp.abono as numeric(8,2))              as abonoCuota
		                              ,CAST(cp.saldo as numeric(8,2))              as saldoCuota
		                              ,ep.descripcion                              as estadoCuota
                                FROM v_CuentaPorCobrar                 cc WITH (NOLOCK) 
                                INNER JOIN Contabilidad.CuotaPorCobrar cp WITH (NOLOCK) ON cp.idCuentaPorCobrar = cc.idCuentaPorCobrar
                                INNER JOIN dbo.EstadoPago              ep WITH (NOLOCK) ON ep.idEstadoPago      = cp.idEstadoPago
                                WHERE cc.idEntidad = @idEntidad
                                  AND cp.estado = 1 '

                    IF @ckCxcVencida = 1 
                        BEGIN
                            SET @sql = @sql + 'AND DATEDIFF(DAY,cp.fechaVencimiento,GETDATE()) > 0 '
                        END 
                END 

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND cc.codDoc = @codDoc '
                END
            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND codDoc IN (''01'',''NE'') '
                END 

            IF @ckCuotas = 0
                BEGIN
                    IF @ckCxcVencida = 1 
                        BEGIN
                            SET @sql = @sql + 'AND DATEDIFF(DAY,CC.fechaVencimiento,GETDATE()) > 0 '
                        END 
                END

            IF @codEstab IS NOT NULL 
                BEGIN
                    SET @sql = @sql + 'AND cc.codEstab = @codEstab '
                END

            IF @convertToDoc IN (1,0)
                BEGIN
                    SET @sql = @sql + 'AND cc.convertToDoc = @convertToDoc '
                END

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(cc.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END 

            IF @idCliente > 0 
                BEGIN
                    SET @sql = @sql + 'AND cc.idCliente = @idCliente '
                END

            IF @dirViviendaCliente IS NOT NULL 
                BEGIN 
                    SET @sql = @sql + ' AND EXISTS (SELECT 1 FROM Cliente cl WHERE cl.idCliente = cc.idCliente AND JSON_VALUE(cl.infoCrediticia, ''$.dirVivienda'') LIKE ''%' + @dirViviendaCliente + '%'') '
                END


            IF @idEmpresa > 0
                BEGIN
                    SET @sql = @sql + 'AND cc.idEmpresa = @idEmpresa '
                END

            IF @idCiudad > 0
                BEGIN
                    SET @nombreReporte = @nombreReporte + ' - ' + (SELECT descripcion FROM dbo.Ciudad WITH(NOLOCK) WHERE idCiudad = @idCiudad)
                    SET @sql = @sql + 'AND idCiudad = @idCiudad '
                END

            IF @idUsuario > 0 
                BEGIN
                    SET @sql = @sql + 'AND idUsuario = @idUsuario '
                END 

            IF @convertToDoc IN (1,0)
                BEGIN
                    SET @sql = @sql + 'AND convertToDoc = @convertToDoc '
                END

            IF @codEstado IS NOT NULL
                BEGIN
                    IF @codEstado = 'NCBR'
                        BEGIN 
                            SET @sql = @sql + 'AND codEstado IN (''PE'',''PP'') '
                        END 
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND codEstado = @codEstado '
                        END 
                END

            SET @sql =  @sql + 'ORDER BY cc.fechaEmision,cc.idCliente,cc.codDoc ' + IIF(@ckCuotas = 1,',cp.nroCuota ','') + 'ASC ' 

            SELECT en.razonSocial
                  ,es.nombreComercial
                  ,en.ruc
                  ,es.telefono
                  ,es.dirEstablecimiento
                  ,@usuario             as usuario 
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT(@fechaFin, 'dd/MM/yyyy') as filtroFechas
                  ,@nombreReporte as nombreReporte
            FROM Sri.Establecimiento es WITH (NOLOCK)
            INNER JOIN dbo.Entidad   en WITH (NOLOCK) ON en.idEntidad = es.idEntidad
            WHERE codEstab = @codEstab

            EXEC sp_executesql @sql
						      ,@params 
                              ,@codEstab     = @codEstab
                              ,@idCliente    = @idCliente
                              ,@fechaInicio  = @fechaInicio
                              ,@fechaFin     = @fechaFin
                              ,@codEstado    = @codEstado
                              ,@codDoc       = @codDoc
                              ,@idEmpresa    = @idEmpresa
                              ,@idEntidad    = @idEntidad
                              ,@idCiudad     = @idCiudad
                              ,@idUsuario    = @idUsuario
                              ,@convertToDoc = @convertToDoc

            RETURN 

        END 

    --> Reporte Ventas
    IF @tipo = 2
        BEGIN
            
            SET @tableNames = 'headerDs,detalleDs'

            SET @nombreReporte = 'Reporte de Ventas'

            SELECT @codDoc         = codDoc 
                  ,@idCliente      = idCliente
                  ,@idUsuario      = idUsuario
                  ,@codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@codEstado      = codEstado
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@convertToDoc   = convertToDoc
                  ,@idCiudad       = idCiudad
            FROM OPENJSON(@json) WITH 
            ( 
                codDoc         VARCHAR(10)
               ,idCliente      INT
               ,idUsuario      INT
               ,codEstab       VARCHAR(100)
               ,idPuntoEmision INT
               ,codEstado      VARCHAR(10)
               ,ckFecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,convertToDoc   BIT
               ,idCiudad       INT
            )
            
            SET @params = '@idEntidad      INT
                          ,@codEstab       VARCHAR(100)
                          ,@idPuntoEmision INT
                          ,@idCliente      INT
                          ,@idUsuario      INT
                          ,@codEstado      VARCHAR(10)
                          ,@fechaInicio    DATETIME2
                          ,@fechaFin       DATETIME2
                          ,@codDoc         VARCHAR(10)
                          ,@convertToDoc   BIT
                          ,@idCiudad INT'

            SET @sql = 'SELECT idEstablecimiento
                              ,nombreComercial
                              ,codDoc
                              ,razonSocialComprador
                              ,serieComprobante
                              ,Format(fechaEmision,''dd/MM/yyyy'')                                                 as fechaEmision
                              ,Format(fechaVencimiento,''dd/MM/yyyy'')                                             as fechaVencimiento
                              ,IIF(codEstado = ''A'' OR codEstado = ''TRA'',0,CAST(importeTotal as numeric(18,2))) as importeTotal
                              ,IIF(codEstado = ''A'' OR codEstado = ''TRA'',0,CAST(mora as numeric(18,2)))         as mora
                              ,CAST(abono as numeric(18,2))                                                        as abono
                              ,IIF(codEstado = ''A'' OR codEstado = ''TRA'',0,CAST(saldo as numeric(18,2)))        as saldo
                              ,estado 
                              ,nombreUsuario                                                                       as usuario
                        FROM v_CuentaPorCobrar WITH (NOLOCK)
                        WHERE idEntidad = @idEntidad '

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND codDoc = @codDoc '
                END 
            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND codDoc IN (''01'',''NE'') '
                END

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND codEstab = @codEstab '
                END 

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND idPuntoEmision = @idPuntoEmision '
                END 

            IF @idCliente >  0
                BEGIN
                    SET @sql = @sql + 'AND idCliente = @idCliente '
                END 

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END 

            IF @convertToDoc IN (1,0)
                BEGIN
                    SET @sql = @sql + 'AND convertToDoc = @convertToDoc '
                END

            IF @idUsuario > 0 
                BEGIN
                    SET @sql = @sql + 'AND idUsuario = @idUsuario '
                END 

            IF @codEstado IS NOT NULL
                BEGIN
                    IF @codEstado = 'NCBR'
                        BEGIN 
                            SET @sql = @sql + 'AND codEstado IN (''PE'',''PP'') '
                        END 
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND codEstado = @codEstado '
                        END 
                END

            IF @idCiudad > 0
                BEGIN
                    SET @nombreReporte = @nombreReporte + ' - ' + (SELECT descripcion FROM dbo.Ciudad WITH(NOLOCK) WHERE idCiudad = @idCiudad)
                    
                    SET @sql = @sql + 'AND idCiudad = @idCiudad '
                END

            SET @sql = @sql + 'ORDER BY  CAST(fechaEmision AS DATE) ASC '

            SELECT razonSocial
                  ,ruc
                  ,telefono
                  ,direccion 
                  ,@usuario  as usuario 
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                  ,@nombreReporte as nombreReporte
            FROM dbo.Entidad WITH (NOLOCK)
            WHERE idEntidad = @idEntidad

            EXEC sp_executesql @sql,@params 
                                   ,@idEntidad      = @idEntidad
                                   ,@codDoc         = @codDoc
                                   ,@codEstab       = @codEstab
                                   ,@idPuntoEmision = @idPuntoEmision
                                   ,@idCliente      = @idCliente
                                   ,@fechaInicio    = @fechaInicio
                                   ,@fechaFin       = @fechaFin
                                   ,@codEstado      = @codEstado
                                   ,@idUsuario      = @idUsuario
                                   ,@convertToDoc   = @convertToDoc
                                   ,@idCiudad       = @idCiudad

            RETURN 
        END 
    
    --> Reporte Rentabildiad Bienes
    IF @tipo = 3
        BEGIN
            
            SET @tableNames = 'headerDs,detalleDs'

			SET @params =  '@idArticulo         INT
	                       ,@idUsuario          INT
                           ,@codEstab           VARCHAR(100)
                           ,@idBodega           INT
						   ,@fechaInicio        DATETIME2
						   ,@fechaFin           DATETIME2
						   ,@idEntidad          INT
                           ,@codDoc             VARCHAR(2)
                           ,@subFamiliasChecked VARCHAR(150)
                           ,@idTarifa           INT
                           ,@idTipoIva          INT'

			SET @sql = 'SELECT tt.articulo
							  ,tt.codArticulo
							  ,cantidad                = CAST(tt.cantidad as numeric(18,2))
                              ,precioCosto             = CAST(tt.precioCostoFraccionado as numeric(18,2))
							  ,precioUnitario          = CAST(tt.precioUnitario as numeric(18,2))
							  ,precioTotalSinImpuestos = CASE WHEN tt.codTransaccion = ''S'' THEN CAST(tt.totalSalida as numeric(18,2)) 
															  WHEN tt.codTransaccion = ''E'' THEN CAST(tt.totalEntrada as numeric(18,2)) 
															  ELSE 0
														 END 
							  ,tarifa                  = CASE tt.codTransaccion WHEN ''S'' THEN tt.tarifa
																				WHEN ''E'' THEN ''COSTO''
																				ELSE ''''
														 END 
							  ,tt.rucClienteProveedor
                              ,tt.clienteProveedor
							  ,fechaRegistro           = FORMAT(tt.fechaRegistro, ''dd/MM/yyyy HH:mm'')
							  ,tt.codDoc
							  ,serieComprobante = tt.nroDocumento
                              ,tt.usuario
                              ,tt.bodega
                              ,me.descripcion as medidaSalida
                              ,tt.subFamilia
                              ,valorRentabilidad           = CAST((tt.precioUnitario - tt.precioCostoFraccionado) as numeric(18,5))
                              
                              ,valorPorcentajeRentabilidad = CAST((( IIF(tt.precioCostoFraccionado >0, (tt.precioUnitario / tt.precioCostoFraccionado), 0) * 100) - 100) as numeric(18,2))
                              ,totalPrecioCosto            = CAST((tt.cantidad * tt.precioCostoFraccionado) as numeric(18,2))
                              ,totalValorRentabilidad      = CAST( (tt.cantidad * (tt.precioUnitario - tt.precioCostoFraccionado)) as numeric(18,2))
						FROM v_InventarioTransaccion            tt 
                        INNER JOIN dbo.Medida                   me ON me.idMedida     = tt.idMedida
                        INNER JOIN dbo.Articulo                 ar ON ar.idArticulo   = tt.idArticulo
                        INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idDocumento  = tt.idDocumento AND cc.codDoc = IIF(tt.codDoc = ''FE'',''01'', tt.codDoc)
                        INNER JOIN dbo.EstadoPago               ep ON ep.idEstadoPago = cc.idEstadoPago
						WHERE tt.idEntidad = @idEntidad 
                          AND tt.estado = 1 
                          AND tt.codTransaccion =''S'' 
                          AND tt.codDoc IN (''FE'', ''NE'')
                          AND ep.codigo NOT IN (''A'') '

			SELECT @ckFecha            = checkBoxFecha
				  ,@idArticulo         = idArticulo
				  ,@idUsuario          = idUsuario 
				  ,@fechaFin           = fechaFin
				  ,@fechaInicio        = fechaInicio
                  ,@idBodega           = idBodega
                  ,@codEstab           = codEstab 
                  ,@codDoc             = codDoc
                  ,@subFamiliasChecked = subFamiliasChecked
                  ,@idTarifa           = idTarifa
                  ,@porcentajeRenta    = porcentajeRenta
                  ,@porcentajeComision = porcentajeComision
                  ,@idTipoIva          = idTipoIva
			FROM OPENJSON(@json) WITH 
			(
				checkBoxArticulo   BIT 
		       ,checkBoxFecha      BIT 
		       ,idArticulo         INT 
		       ,idUsuario          INT
		       ,fechaInicio        DATETIME2
		       ,fechaFin           DATETIME2 
               ,idBodega           INT  
               ,codEstab           VARCHAR(100)
               ,codDoc             VARCHAR(2)
               ,subFamiliasChecked VARCHAR(150) 
               ,idTarifa           INT
               ,porcentajeRenta    NUMERIC(18,5)
               ,porcentajeComision NUMERIC(18,5)
               ,idTipoIva          INT
			)

			SELECT TOP 1 @usuario = 'Usuario : ' + nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

			IF @ckFecha = 1
				BEGIN
					SET @sql = @sql + 'AND CAST(tt.fechaRegistro as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
				END

            IF @idTipoIva > 0
                BEGIN
                    SELECT TOP 1 @iva = descripcion FROM dbo.TipoIva WHERE idTipoIva = @idTipoIva

                    SET @sql = @sql + 'AND ar.idTipoIva = @idTipoIva '
                END 

			IF @idArticulo > 0
				BEGIN
					SET @sql = @sql + 'AND tt.idArticulo = @idArticulo '
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

            IF @codDoc IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND tt.codDoc = @codDoc '
                END 
            
            IF @subFamiliasChecked IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND tt.idSubFamilia IN (SELECT value FROM STRING_SPLIT(@subFamiliasChecked, '',''))'
                END 

            IF @idTarifa IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND tt.idTarifa = @idTarifa '
                END 

			SET @sql = @sql + 'ORDER BY tt.articulo,tt.fechaRegistro ASC '

			--> Entidad 
			SELECT e.ruc
				  ,e.razonSocial 
				  ,e.nombreComercial	
				  ,ISNULL(e.telefono, '')                                                       as telefonoEntidad
				  ,ISNULL(e.direccion, '')                                                      as direccionEntidad			
				  ,'REPORTE RENTABILIDAD BIENES '+ '- ' + @iva                                  as tituloReporte
				  ,@usuario                                                                     as usuario
				  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy') as filtroFecha
                  ,@porcentajeRenta                                                             as porcentajeRenta
                  ,@porcentajeComision                                                          as porcentajeComision
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad 
			
			EXEC sp_executesql @sql
							  ,@params
							  ,@idArticulo         = @idArticulo
                              ,@codEstab           = @codEstab
                              ,@idBodega           = @idBodega
							  ,@idEntidad          = @idEntidad
							  ,@idUsuario          = @idUsuario 
							  ,@fechaInicio        = @fechaInicio
							  ,@fechaFin           = @fechaFin
                              ,@codDoc             = @codDoc
                              ,@subFamiliasChecked = @subFamiliasChecked
                              ,@idTarifa           = @idTarifa
                              ,@idTipoIva          = @idTipoIva

			RETURN
        END 

    --> Reporte Rentabilidad Servicios 
    IF @tipo = 4
        BEGIN
            
            SET @tableNames = 'headerDs,detalleDs'

			SET @params =  '@idArticulo         INT
	                       ,@idUsuario          INT
                           ,@codEstab           VARCHAR(100)
                           ,@idBodega           INT
						   ,@fechaInicio        DATETIME2
						   ,@fechaFin           DATETIME2
						   ,@idEntidad          INT
                           ,@codDoc             VARCHAR(2)
                           ,@subFamiliasChecked VARCHAR(150)
                           ,@idTarifa           INT
                           ,@idTipoIva          INT'

			SET @sql = 'SELECT cu.IdCard   											                      as rucClienteProveedor
                              ,cu.BusinessName										                      as clienteProveedor
                              ,td.codigo                                                                  as codDoc
	                          ,[Common].[ufnGetSerieDocument](es.estab,pe.ptoEmi,se.Secuencial,0)         as serieComprobante
	                          ,FORMAT(se.FechaEmision,''dd/MM/yyyy'')							          as fechaRegistro
	                          ,sf.descripcion                                                             as subFamilia
	                          ,ar.codigo													              as codArticulo
	                          ,se.Descripcion + '' '' + ISNULL(se.Nota,'''')				              as articulo
	                          ,me.descripcion													          as medidaSalida
	                          ,bo.descripcion										                      as bodega
	                          ,ta.descripcion													          as tarifa
	                          ,CAST(se.Cantidad as numeric(18,2))								          as cantidad
	                          ,CAST(se.PrecioCosto as numeric(18,2))					                  as precioCosto
	                          ,CAST(se.PrecioUnitario as numeric(18,2))							          as precioUnitario
	                          ,CAST(se.PrecioUnitario - se.PrecioCosto as numeric(18,2))                  as valorRentabilidad
	                          ,CAST(((se.PrecioUnitario - se.PrecioCosto) * 100) - 100 as numeric(18,2))  as valorPorcentajeRentabilidad
	                          ,CAST(se.PrecioTotalSinImpuesto as numeric(18,2))                           as precioTotalSinImpuestos
                              ,CAST(se.Cantidad * se.PrecioCosto as numeric(18,2))					      as totalPrecioCosto
	                          ,CAST(se.Cantidad * (se.PrecioUnitario - se.PrecioCosto) as numeric(18,2))  as totalValorRentabilidad
                              ,us.nombreUsuario                                                           as usuario
                        FROM Contabilidad.Servicio          se WITH (NOLOCK)
                        INNER JOIN dbo.Articulo             ar WITH (NOLOCK) ON ar.idArticulo        = se.ArticuloId
                        INNER JOIN Inventario.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento   = se.TipoDocumentoId
                        INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision    = se.PuntoEmisionId
                        INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente         = se.ClienteId
                        INNER JOIN dbo.Medida               me WITH (NOLOCK) ON me.idMedida          = se.MedidaId
                        INNER JOIN dbo.Bodega               bo WITH (NOLOCK) ON bo.idBodega          = se.BodegaId
                        INNER JOIN dbo.Tarifa               ta WITH (NOLOCK) ON ta.idTarifa          = se.TarifaId
                        INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario         = se.UsuarioId
						INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id			     = cl.CustomerId
                        INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                         LEFT JOIN dbo.SubFamilia           sf WITH (NOLOCK) ON sf.idSubFamilia      = ar.idSubFamilia
                        WHERE ar.idEntidad = @idEntidad
                          AND se.Estado     = 1  '

			SELECT @ckFecha            = checkBoxFecha
				  ,@idArticulo         = idArticulo
				  ,@idUsuario          = idUsuario 
				  ,@fechaFin           = fechaFin
				  ,@fechaInicio        = fechaInicio
                  ,@idBodega           = idBodega
                  ,@codEstab           = codEstab 
                  ,@codDoc             = codDoc
                  ,@subFamiliasChecked = subFamiliasChecked
                  ,@idTarifa           = idTarifa
                  ,@porcentajeRenta    = porcentajeRenta
                  ,@porcentajeComision = porcentajeComision
                  ,@idTipoIva          = idTipoIva
			FROM OPENJSON(@json) WITH 
			(
				checkBoxArticulo   BIT 
		       ,checkBoxFecha      BIT 
		       ,idArticulo         INT 
		       ,idUsuario          INT
		       ,fechaInicio        DATETIME2
		       ,fechaFin           DATETIME2 
               ,idBodega           INT  
               ,codEstab           VARCHAR(100)
               ,codDoc             VARCHAR(2)
               ,subFamiliasChecked VARCHAR(150) 
               ,idTarifa           INT
               ,porcentajeRenta    NUMERIC(18,5)
               ,porcentajeComision NUMERIC(18,5)
               ,idTipoIva          INT
			)

			SELECT TOP 1 @usuario = 'Usuario : ' + nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

			IF @ckFecha = 1
				BEGIN
					SET @sql = @sql + 'AND CAST(se.FechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
				END

            IF @idTipoIva > 0
                BEGIN
                    SELECT TOP 1 @iva =  descripcion FROM dbo.TipoIva WHERE idTipoIva = @idTipoIva

                    SET @sql = @sql + 'AND ar.idTipoIva = @idTipoIva '
                END

			IF @idArticulo > 0
				BEGIN
					SET @sql = @sql + 'AND se.ArticuloId = @idArticulo '
				END 

			IF @idUsuario > 0 
				BEGIN
					SET @sql = @sql + 'AND se.UsuarioId = @idUsuario '
				END

             IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND es.codEstab = @codEstab '
                END 

            IF @idBodega > 0 
                BEGIN
                    SET @sql = @sql + 'AND se.BodegaId = @idBodega '
                END 

            IF @codDoc IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND td.codigo = @codDoc '
                END 
            
            IF @subFamiliasChecked IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND ar.idSubFamilia IN (SELECT value FROM STRING_SPLIT(@subFamiliasChecked, '',''))'
                END 

            IF @idTarifa IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND se.TarifaId = @idTarifa '
                END 

			SET @sql = @sql + 'ORDER BY se.ArticuloId,se.FechaEmision ASC '

			--> Entidad 
			SELECT e.ruc
				  ,e.razonSocial 
				  ,e.nombreComercial	
				  ,ISNULL(e.telefono, '')                                                       as telefonoEntidad
				  ,ISNULL(e.direccion, '')                                                      as direccionEntidad			
                  ,'REPORTE RENTABILIDAD SERVICIOS '+ '- ' + @iva                               as tituloReporte
				  ,@usuario                                                                     as usuario
				  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy') as filtroFecha
                  ,@porcentajeRenta                                                             as porcentajeRenta
                  ,@porcentajeComision                                                          as porcentajeComision
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad  
			
			EXEC sp_executesql @sql
							  ,@params
							  ,@idArticulo         = @idArticulo
                              ,@codEstab           = @codEstab
                              ,@idBodega           = @idBodega
							  ,@idEntidad          = @idEntidad
							  ,@idUsuario          = @idUsuario 
							  ,@fechaInicio        = @fechaInicio
							  ,@fechaFin           = @fechaFin
                              ,@codDoc             = @codDoc
                              ,@subFamiliasChecked = @subFamiliasChecked
                              ,@idTarifa           = @idTarifa
                              ,@idTipoIva          = @idTipoIva

			RETURN
        END 
    
    --> Reporte de Estado de Cuenta
    IF @tipo = 5
        BEGIN
            
            SET @tableNames = 'comprobanteDs,cuotaDs,cobroDs'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT cc.serieComprobante
                  ,FORMAT(cc.fechaEmision,'dd/MM/yyyy')           as fechaEmision
                  ,FORMAT(cc.fechaVencimiento,'dd/MM/yyyy')       as fechaVencimiento
                  ,CAST(cc.importeTotal as numeric(18,2))         as importeTotal
                  ,CAST(cc.abono as numeric(18,2))                as abono
                  ,CAST(cc.saldo as numeric(18,2))                as saldo
                  ,cc.razonSocialComprador 
                  ,cc.identificacionComprador
                  ,cc.nombreComercial
                  ,cc.ruc
                  ,cc.dirEstablecimiento
                  ,cc.telefonoEstablecimiento
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.idCuentaPorCobrar = @id

            SELECT cx.nroCuota
                  ,FORMAT(cx.fechaVencimiento,'dd/MM/yyyy') as fechaVencimiento
                  ,CAST(cx.cuota as numeric(18,2))          as cuota
                  ,CAST(cx.diasMora as int)                 as diasMora
                  ,CAST(cx.mora as numeric(18,2))           as mora
                  ,CAST(cx.abono as numeric(18,2))          as abono
                  ,CAST(cx.saldo as numeric(18,2))          as saldo
            FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK) 
            WHERE cx.idCuentaPorCobrar = @id
              AND cx.estado = 1

            SELECT cx.nroCuota
                  ,FORMAT(co.fechaEmision,'dd/MM/yyyy') as fechaEmision
                  ,ef.descripcion 
                  ,CAST(cd.abono as numeric(18,2))      as abono
                  ,(
	                CASE ef.codigo WHEN 'EFE' THEN  ''
								              ELSE  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), '$.nro')
	                END
	               )																						AS nro
                  ,(
	                CASE WHEN ef.codigo IN ( 'TAR','CHE') THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), '$.referencia') 
								                          ELSE  ''
	                END
	               )																					    AS referencia
            FROM dbo.CobroDetalle                  cd WITH (NOLOCK) 
            INNER JOIN Contabilidad.CuotaPorCobrar cx WITH (NOLOCK) ON cx.idCuotaPorCobrar     = cd.idCuotaPorCobrar
            INNER JOIN dbo.Cobro                   co WITH (NOLOCK) ON co.idCobro              = cd.idCobro
            INNER JOIN dbo.EntidadFinanciera       ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
            INNER JOIN dbo.ComprobanteIngreso      ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
            WHERE cx.idCuentaPorCobrar = @id
              AND ci.estado = 1
            ORDER BY cx.nroCuota ASC

            RETURN 
        END 

    --> Reporte de Solicitudad de credito
    IF @tipo = 6
        BEGIN   
            
            DECLARE @idDocumento INT

            SELECT @id = id,@codEstab =codEstab FROM OPENJSON(@json) WITH (id INT, codEstab VARCHAR(100))

            SELECT @codDoc = codDoc, @idDocumento = idDocumento FROM v_CuentaPorCobrar WHERE idCuentaPorCobrar = @id

            SET @tableNames = 'headerDs,cuentaPorCobrarDs,creditoGaranteDs,productsDs,productDatoAdicionalDs,cuotaDs';

            -- Header Dataset
            SELECT en.razonSocial
                  ,es.nombreComercial
                  ,en.ruc
                  ,es.telefono
                  ,es.dirEstablecimiento
                  ,@usuario AS usuario
                  ,'SOLICITUD CREDITO' AS nombreReporte
                  ,telEstab = es.telefono
            FROM Sri.Establecimiento es WITH (NOLOCK)
            INNER JOIN dbo.Entidad   en WITH (NOLOCK) ON en.idEntidad = es.idEntidad
            WHERE es.codEstab = @codEstab;

            -- Cuenta por Cobrar Dataset
            SELECT IIF(cc.codDoc = '01','Factura','Nota Entrega') as tipoDoc
                  ,cc.serieComprobante
                  ,FORMAT(cc.fechaEmision,'dd/MM/yyyy')           as fechaEmision                       
                  ,cc.razonSocialComprador
                  ,cc.identificacionComprador
                  ,CAST(cc.importeTotal as numeric(18,2))         as importeTotal
                  ,cl.direccion                                   as dirComprador
                  ,cl.telefono                                    as telComprador
                  ,cl.correo                                      as correoComprador
                  ,cl.ciudadNom                                   as ciudadComprador
                  ,cl.empresa                                     as empresaNom
                  ,ic.conyugeNombre
                  ,ic.conyugeTel
                  ,ic.refFamNombre
                  ,ic.dirVivienda
                  ,ic.refDomicilio
                  ,ic.refFamTel
                  ,ms.[Name]                                      as estadoCivilNom
                  ,ht.[Name]                                      as tipoViviendaNom
                  ,cu.IDCard                                      as identificacionEmpresa
                  ,ae.direccion                                   as dirEmpresa
                  ,ae.correo                                      as correoEmpresa
                  ,ae.telefono                                    as telEmpresa
            FROM dbo.v_CuentaPorCobrar       cc WITH (NOLOCK) 
            INNER JOIN dbo.v_cliente         cl WITH (NOLOCK) ON cl.idCliente = cc.idCliente
             LEFT JOIN Administrador.Empresa ae WITH (NOLOCK) ON ae.idEmpresa = cl.idEmpresa
             LEFT JOIN Customer.Customer     cu WITH (NOLOCK) ON cu.Id        = ae.CustomerId
            OUTER  APPLY OPENJSON (cl.infoCrediticia)
            WITH
            (
	             maritalStatusId INT
	            ,housingTypeId   INT
	            ,conyugeNombre   VARCHAR(150)
	            ,conyugeTel      VARCHAR(100)
	            ,refFamNombre    VARCHAR(100) 
	            ,dirVivienda     VARCHAR(150)
	            ,refDomicilio    VARCHAR(100) 
	            ,refFamTel       VARCHAR(100)

            )                            as ic
            LEFT JOIN Common.MaritalStatus  ms WITH(NOLOCK) ON ms.Id = ic.maritalStatusId
            LEFT JOIN Common.HousingType    ht WITH(NOLOCK) ON ht.Id = ic.housingTypeId 
            WHERE cc.idCuentaPorCobrar = @id

            -- Credito Garante DataSet
            SELECT razonSocialGarante = cl.BusinessName
                  ,identificacionGarante = cl.IDCard
                  ,dirGarante = cl.direccion
                  ,telGarante = cl.telefono
                  ,correoGarante = cl.correo
                  ,ciudadGarante = cl.ciudadNom
                  ,ic.conyugeNombre
                  ,ic.conyugeTel
                  ,ic.refFamNombre
                  ,ic.dirVivienda
                  ,ic.refDomicilio
                  ,ic.refFamTel
                  ,estadoCivilNom = ms.[Name]
                  ,tipoViviendaNom = ht.[Name]
                  ,empresaNom = cc.BusinessName
                  ,identificacionEmpresa = cc.IDCard
                  ,dirEmpresa = ae.direccion
                  ,correoEmpresa = ae.correo
                  ,telEmpresa = ae.telefono
            FROM Ventas.CreditoGarante       cg WITH (NOLOCK)
            INNER JOIN dbo.v_cliente         cl WITH (NOLOCK) ON cl.idCliente = cg.idCliente
             LEFT JOIN Administrador.Empresa ae WITH (NOLOCK) ON ae.idEmpresa = cl.idEmpresa
             LEFT JOIN Customer.Customer     cc WITH (NOLOCK) ON cc.Id        = ae.CustomerId
            OUTER  APPLY OPENJSON (cl.infoCrediticia)
            WITH
            (
	             maritalStatusId INT
	            ,housingTypeId   INT
	            ,conyugeNombre   VARCHAR(150)
	            ,conyugeTel      VARCHAR(100)
	            ,refFamNombre    VARCHAR(100) 
	            ,dirVivienda     VARCHAR(150)
	            ,refDomicilio    VARCHAR(100) 
	            ,refFamTel       VARCHAR(100)

            )                            as ic
            LEFT JOIN Common.MaritalStatus  ms WITH(NOLOCK) ON ms.Id = ic.maritalStatusId
            LEFT JOIN Common.HousingType    ht WITH(NOLOCK) ON ht.Id = ic.housingTypeId 
            WHERE cg.estado = 1 
              AND cg.idCuentaPorCobrar = @id

            -- Detalle DataSet 
            IF @codDoc ='01'
                BEGIN 
                   SELECT ar.codigo
                         ,fd.descripcion
                         ,me.descripcion                                    as medida
                         ,CAST(fd.cantidad as numeric(18, 2))               as cantidad
                         ,CAST(fd.precioUnitario as numeric(18, 2))         as precioUnitario
                         ,CAST(fd.valorDescuento as numeric(18, 2))         as valorDescuento
                         ,CAST(fd.precioTotalSinImpuesto as numeric(18, 2)) as precioTotal
                         ,IIF(fd.nota = 'S/N', '', fd.nota)                 as nota
                         ,CAST(fd.valorImpuesto AS numeric(18, 2))          as valorImpuesto
                    FROM dbo.FacturaDetalle fd WITH (NOLOCK)
                    INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = fd.idArticulo
                    INNER JOIN dbo.Medida   me WITH (NOLOCK) ON me.idMedida   = fd.idMedida
                    WHERE fd.idFactura = @idDocumento
                      AND fd.estado = 1  
                      AND fd.envioSri = 1
                    ORDER BY fd.idFacturaDetalle ASC; 

                    SELECT t2.idFacturaDetalle as rowId
                          ,t2.descripcion
                          ,ar.codigo
                          ,ja.[key]            as nombre
                          ,ja.[value]          as descValor 
                    FROM Ventas.HistoryInfoAdicional       t1
                    LEFT JOIN FacturaDetalle               t2 WITH (NOLOCK) ON t2.idFacturaDetalle = t1.idFacturaDetalle 
                    INNER JOIN Compra.InfoAdicional        t3 WITH (NOLOCK) ON t3.idInfoAdicional  = t1.idInfoAdicional
                    INNER JOIN dbo.Articulo                ar WITH (NOLOCK) ON ar.idArticulo = t2.idArticulo
                    CROSS APPLY OPENJSON(t3.jsonAdicional) ja
                    WHERE t2.idFactura = @idDocumento 
                      AND t1.estado = 1  
                END 

            IF @codDoc ='NE'
                BEGIN
                    SELECT ar.codigo
                          ,CAST(nd.cantidad as numeric(18, 2))               as cantidad
                          ,nd.descripcion
                          ,CAST(nd.precioUnitario as numeric(18, 2))         as precioUnitario
                          ,CAST(nd.valorDescuento as numeric(18, 2))         as valorDescuento
                          ,CAST(nd.precioTotalSinImpuesto as numeric(18, 2)) as precioTotal
                          ,me.descripcion                                    as medida
                          ,nd.nota                                           as nota
                          ,CAST(nd.valorImpuesto as numeric(18, 2))          as valorImpuesto
                    FROM dbo.NotaEntregaDetalle nd WITH (NOLOCK)
                    INNER JOIN dbo.Medida       me WITH (NOLOCK) ON me.idMedida   = nd.idMedida
                    INNER JOIN dbo.Articulo     ar WITH (NOLOCK) ON ar.idArticulo = nd.idArticulo 
                    WHERE nd.idNotaEntrega = @idDocumento 
                      AND nd.estado = 1
                    ORDER BY nd.idNotaEntregaDetalle ASC


                     SELECT t2.idNotaEntregaDetalle as rowId
                           ,t2.descripcion
                           ,ar.codigo
                           ,ja.[key] AS nombre
                           ,ja.[value] AS descValor 
                    FROM Ventas.HistoryInfoAdicional       t1
                    LEFT JOIN dbo.NotaEntregaDetalle       t2 WITH (NOLOCK) ON t2.idNotaEntregaDetalle = t1.idNotaEntregaDetalle 
                    INNER JOIN Compra.InfoAdicional        t3 WITH (NOLOCK) ON t3.idInfoAdicional      = t1.idInfoAdicional
                    INNER JOIN dbo.Articulo                ar WITH (NOLOCK) ON ar.idArticulo           = t2.idArticulo
                    CROSS APPLY OPENJSON(t3.jsonAdicional) ja
                    WHERE t2.idNotaEntrega = @idDocumento 
                      AND t1.estado = 1  

                END 

           

            -- Cuota DataSet
            SELECT cx.nroCuota
                  ,FORMAT(cx.fechaVencimiento,'dd/MM/yyyy') as fechaVencimiento
                  ,CAST(cx.cuota as numeric(18,2))          as cuota
                  ,CAST(cx.abono as numeric(18,2))          as abono
                  ,CAST(cx.saldo as numeric(18,2))          as saldo
            FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK) 
            WHERE cx.idCuentaPorCobrar = @id
              AND cx.estado = 1
            ORDER BY cx.nroCuota ASC


            RETURN 
        END 
    
    --> Reporte de Deudores
    IF @tipo = 7
        BEGIN
            SET @tableNames = 'headerDs,detalleDs'

            SET @nombreReporte = 'Deudores'

            SELECT @codEstab           = codEstab
                  ,@dirViviendaCliente = dirViviendaCliente
                  ,@idCiudad           = idCiudad
                  ,@ckCxcVencida       = ckCxcVencida
            FROM OPENJSON(@json) WITH 
            (
                codEstab           VARCHAR(25) 
               ,dirViviendaCliente VARCHAR(150) 
               ,idCiudad           INT
               ,ckCxcVencida       BIT
            )

            SET @sql = 'SELECT dt.razonSocial
                              ,dt.identificacion
                              ,dt.direccion
                              ,dt.telefono
                              ,dt.refDomicilio
                              ,SUM(dt.importeTotal) as importeTotal
                              ,SUM(dt.mora)         as mora
                              ,SUM(dt.abono)        as abono
                              ,SUM(dt.saldo)        as saldo
                              ,SUM(dt.diasMora)     as diasMora
                        FROM
                        (

                            SELECT cu.BusinessName                                  as razonSocial 
	                              ,cu.IdCard	                                    as identificacion
	                              ,cl.direccion
                                  ,JSON_VALUE(cl.infoCrediticia,''$.dirVivienda'') +  '' | '' + JSON_VALUE(cl.infoCrediticia,''$.refDomicilio'') as refDomicilio
	                              ,cl.telefono
	                              ,CAST(cc.importeTotal as numeric(18,2))           as importeTotal
	                              ,CAST(cc.mora as numeric(18,2))                   as mora
	                              ,CAST(cc.abono as numeric(18,2))                  as abono
	                              ,CAST(cc.saldo as numeric(18,2))                  as saldo
	                              ,cc.diasMora
                            from contabilidad.cuentaporcobrar cc WITH (NOLOCK)
                            INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision    = cc.idPuntoEmision
                            INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente         = cc.idCliente
                            INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago      = cc.idEstadoPago
                            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id			       = cl.CustomerId
                            WHERE es.idEntidad = @idEntidad
                              AND (ep.codigo = ''PE'' OR ep.codigo = ''PP'')
                              AND cc.codDoc IN (''01'',''NE'')
                         '

            SET @params = '@codEstab  VARCHAR(25)
                          ,@idEntidad INT
                          ,@idCiudad  INT'
                          
            IF @codEstab IS NOT NULL 
                BEGIN
                    SET @sql = @sql + 'AND es.codEstab = @codEstab '
                END

            IF @ckCxcVencida = 1
                BEGIN
                    SET @sql = @sql + 'AND cc.diasMora > 0 '
                END 

            IF @ckCxcVencida = 1
                BEGIN
                    SET @sql = @sql + 'AND cc.diasMora > 0 '
                END 

            IF @dirViviendaCliente IS NOT NULL 
                BEGIN 
                    SET @sql = @sql + ' AND (
                                                   JSON_VALUE(cl.infoCrediticia, ''$.refDomicilio'') LIKE ''%' + @dirViviendaCliente + '%'' 
                                                OR JSON_VALUE(cl.infoCrediticia, ''$.dirVivienda'')  LIKE ''%' + @dirViviendaCliente + '%''
                                                OR cl.direccion                                      LIKE ''%' + @dirViviendaCliente + '%''
                                            )
                                             '
                END

            IF @idCiudad > 0
                BEGIN
                    SET @nombreReporte =  @nombreReporte + (SELECT TOP 1 ' - ' + descripcion FROM dbo.Ciudad WITH (NOLOCK) WHERE idCiudad = @idCiudad )

                    SET @sql = @sql + 'AND idCiudad = @idCiudad '
                END

           

            SET @sql = @sql + ' ) AS dt GROUP BY dt.razonSocial
                                                ,dt.identificacion
                                                ,dt.direccion
                                                ,dt.telefono
                                                ,dt.refDomicilio ORDER BY dt.razonSocial ASC '
            
            

            SELECT en.razonSocial
                  ,es.nombreComercial
                  ,en.ruc
                  ,es.telefono
                  ,es.dirEstablecimiento
                  ,@usuario             as usuario
                  ,@nombreReporte       as nombreReporte
            FROM Sri.Establecimiento es WITH (NOLOCK)
            INNER JOIN dbo.Entidad   en WITH (NOLOCK) ON en.idEntidad = es.idEntidad
            WHERE es.codEstab = @codEstab

            EXEC sp_executesql @sql
						      ,@params 
                              ,@codEstab  = @codEstab
                              ,@idEntidad = @idEntidad
                              ,@idCiudad  = @idCiudad

            RETURN 
        END 
END
GO
