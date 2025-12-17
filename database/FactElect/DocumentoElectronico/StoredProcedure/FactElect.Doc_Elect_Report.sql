   USE AcontPlus
GO
CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Report @idUsuarioRol INT,@json NVARCHAR(max)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    -->Filter
    DECLARE @codEstab VARCHAR(100) ,@idPuntoEmision INT ,@ckFecha BIT ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2 ,@codEstado INT ,@ckDevolucion BIT ,@ckRetencion BIT
           ,@identificacion VARCHAR(20) ,@idUsuario INT

    BEGIN TRY

    --> Recuperar Datos
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

    --> Factura
    IF @tipo = 2
        BEGIN

            SELECT @codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@codEstado      = codEstado
                  ,@ckDevolucion   = ckDevolucion
                  ,@ckRetencion    = ckRetencion
                  ,@codEstado      = codEstado
                  ,@identificacion = identificacion
                  ,@idUsuario      = idUsuario
            FROM OPENJSON(@json) WITH
            (
                codEstab       VARCHAR(100)
               ,idPuntoEmision INT
               ,ckFecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,codEstado      INT
               ,ckDevolucion   BIT
               ,ckRetencion    BIT
               ,identificacion VARCHAR(20)
               ,idUsuario      INT
            )

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@idPuntoEmision  INT
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@codEstado       INT
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            --> Comprobantes

            SET @sql = 'SELECT f.idFactura
                              ,f.nombreComercial
                              ,f.idEstablecimiento
                              ,f.serieComprobante
                              ,f.claveAcceso
	                          ,Format(f.fechaEmision,''dd/MM/yyyy'')			 as fechaEmision
	                          ,Format(f.fechaAutorizacion,''dd/MM/yyyy  HH:mm'') as fechaAutorizacion
	                          ,f.razonSocialComprador
	                          ,f.identificacionComprador
	                          ,f.nombreUsuario								     as usuario
	                          ,fi.tax										     as impuesto
	                          ,CAST(SUM(fi.TaxBase) as numeric(18,2))		     as subTotal
	                          ,CAST(SUM(fi.TaxValue) as numeric(18,2))		     as iva
	                          ,CAST(nc.total as numeric(18,2))				     as devolucion
	                          ,(
                                    SELECT SUM(CAST(di.TaxValue as numeric(18,2)))
                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK)
                                    WHERE di.DocumentoRecibidoId = dr.idDocumentoRecibido
                                      AND di.code = ''1''
                               )                                                 as retRenta
                              ,(
                                    SELECT SUM(CAST(di.TaxValue as numeric(18,2)))
                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK)
                                    WHERE di.DocumentoRecibidoId = dr.idDocumentoRecibido
                                    AND di.code = ''2''
                               )                                                 as retIva
	                          ,CAST(f.totalDescuento as numeric(18,2))           as totalDescuento
                            ,CAST(SUM(fi.TaxBase) as numeric(18,2)) + CAST(SUM(fi.TaxValue) as numeric(18,2)) as total
	                          ,f.estadoSri
                        FROM Ventas.v_Factura			       f WITH (NOLOCK)
                        INNER JOIN Ventas.v_FacturaImpuesto    fi WITH (NOLOCK) ON fi.FacturaId   = f.idFactura
                         LEFT JOIN Ventas.v_NotaCredito        nc WITH (NOLOCK) ON nc.idFactura   = f.idFactura
                         LEFT JOIN FactElect.DocRelacionado    dr WITH (NOLOCK) ON dr.claveAcceso = f.claveAcceso
                        WHERE f.idEntidad = @idEntidad
                          AND fi.[Enabled] = 1 '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND f.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND f.idPuntoEmision = @idPuntoEmision '
                END

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(f.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END

            IF @codEstado >= 0
                BEGIN
                    IF @codEstado IN (4,6)
                        BEGIN
                            SET @sql = @sql + 'AND f.codEstado = @codEstado '
                        END
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND f.codEstado NOT IN(4,6) '
                        END
                END

            IF @identificacion IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND f.identificacionComprador = @identificacion '
                END

            IF @idUsuario IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND f.idUsuario = @idUsuario '
                END

            IF @ckDevolucion IN (0,1)
                BEGIN
                    IF @ckDevolucion = 1
                        BEGIN
                            SET @sql = @sql + 'AND nc.idNotaCredito > 0 '
                        END

                    IF @ckDevolucion = 0
                        BEGIN
                            SET @sql = @sql + 'AND nc.idNotaCredito IS NULL '
                        END

                END


            IF @ckRetencion IN (1,0)
                BEGIN
                    IF @ckRetencion  = 1
                        BEGIN
                            SET @sql = @sql + 'AND dr.idDocRelacionado > 0 '
                        END
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND dr.idDocRelacionado IS NULL '
                        END
                END

            SET @sql = @sql + 'GROUP BY f.idFactura
                                       ,f.nombreComercial
                                       ,f.serieComprobante
                                       ,f.claveAcceso
	                                   ,f.fechaEmision
	                                   ,f.fechaAutorizacion
	                                   ,f.razonSocialComprador
	                                   ,f.identificacionComprador
	                                   ,f.nombreUsuario
		                               ,f.total
		                               ,f.totalDescuento
                                       ,f.idEstablecimiento
		                               ,f.estadoSri
		                               ,dr.valorRetenido
                                       ,nc.total
		                               ,fi.tax
                                       ,dr.idDocumentoRecibido
                                       ,dr.idDocumentoElectronico
                                       ,f.idCuentaPorCobrar
                                       ORDER BY f.serieComprobante,f.fechaEmision,f.identificacionComprador DESC '


            SELECT entidad as razonSocial
                  ,rucEmpresa as ruc
                  ,telefono
                  ,nombreUsuario as usuario
                  ,'Reporte Tributario - Factura' as nombreReporte
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
            FROM v_usuario
            WHERE idUsuarioRol = @idUsuarioRol

            EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@idPuntoEmision = @idPuntoEmision
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@codEstado      = @codEstado
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario



        END

    --> Nota Credito
    IF @tipo = 3
        BEGIN
            SELECT @codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@codEstado      = codEstado
                  ,@identificacion = identificacion
                  ,@idUsuario      = idUsuario
            FROM OPENJSON(@json) WITH
            (
                codEstab       VARCHAR(100)
               ,idPuntoEmision INT
               ,ckFecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,codEstado      INT
               ,identificacion VARCHAR(20)
               ,idUsuario      INT
            )

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@idPuntoEmision  INT
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@codEstado       INT
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            SET @sql = 'SELECT ncp.nombreComercial
							  ,ncp.idEstablecimiento
                              ,ncp.claveAcceso
						      ,dbo.AFTGenerarNroDocumento(ncp.estab+ncp.ptoEmi,ncp.secuencial) as serieComprobante
							  ,Format(ncp.fechaEmision,''dd/MM/yyyy'')                         as fechaEmision
                              ,Format(ncp.fechaAutorizacion,''dd/MM/yyyy HH:mm'')              as fechaAutorizacion
							  ,ncp.identificacionComprador
							  ,ncp.razonSocialComprador
							  ,ncp.numDocSustento                                              as nroFactura
							  ,ISNULL
                                ((
                                    SELECT CAST(SUM(ni.TaxBase)as numeric(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId  = ncp.idNotaCredito
                                      AND ni.codigo           = ''2''
                                      AND ni.codigoPorcentaje = ''7''
                                      AND ni.[Enabled] = 1

                                ),0) as subTotalExento

							  ,ISNULL
                                ((
                                    SELECT CAST(SUM(ni.TaxBase)as numeric(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId = ncp.idNotaCredito
                                      AND ni.codigo = ''2''
                                      AND ni.codigoPorcentaje = ''6''
                                      AND ni.[Enabled] = 1

                                ),0) as subTotalNoObjetoIva
                                ,ISNULL((
                                    SELECT CAST(SUM(ni.TaxBase) AS NUMERIC(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId  = ncp.idNotaCredito
                                    AND ni.codigo           = ''2''
                                    AND ni.codigoPorcentaje = ''5''
                                    AND ni.[Percent] > 0
                                    AND ni.[Enabled] = 1

                                ),0) as subTotalIvaCinco

                                ,ISNULL((
                                    SELECT CAST(SUM(ni.TaxBase) AS NUMERIC(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId  = ncp.idNotaCredito
                                    AND ni.codigo           = ''2''
                                    AND ni.codigoPorcentaje = ''4''
                                    AND ni.[Percent] > 0
                                    AND ni.[Enabled] = 1
                                ),0) as subTotalIvaQuince

	                           ,ISNULL
                                ((
                                    SELECT CAST(SUM(ni.TaxBase)as numeric(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId  = ncp.idNotaCredito
                                    AND ni.codigo           = ''2''
                                    AND ni.codigoPorcentaje = ''0''
                                    AND ni.[Enabled] = 1
                                ),0) as subTotalIvaCero

	                           ,ISNULL
                                ((
                                    SELECT CAST(SUM(ni.TaxBase)as numeric(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId  = ncp.idNotaCredito
                                    AND ni.codigo           = ''2''
                                    AND ni.codigoPorcentaje = ''2''
                                    AND ni.[Percent] > 0
                                    AND ni.[Enabled] = 1
                                ),0) as subTotalIva

	                            ,CAST(ncp.subTotalSinImpuestos  as numeric(18,2))  as precioTotalSinImpuestos

                               ,ISNULL
                                ((
                                    SELECT CAST(SUM(ni.TaxValue)    AS NUMERIC(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId          = ncp.idNotaCredito
                                    AND ni.codigo                   = ''2''
                                    AND ni.codigoPorcentaje         = ''2''
                                    AND ni.[Enabled] = 1
                                ),0) as iva

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(ni.TaxValue)    AS NUMERIC(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId          = ncp.idNotaCredito
                                    AND ni.codigo                   = ''2''
                                    AND ni.codigoPorcentaje         = ''5''
                                    AND ni.[Enabled] = 1
                                ),0) as iva5

                                ,ISNULL
                                ((
                                    SELECT CAST(SUM(ni.TaxValue)    AS NUMERIC(18,2))
                                    FROM Ventas.v_NotaCreditoImpuesto ni
                                    WHERE ni.NotaCreditoId          = ncp.idNotaCredito
                                    AND ni.codigo                   = ''2''
                                    AND ni.codigoPorcentaje         = ''4''
                                    AND ni.[Enabled] = 1

                                ),0) AS iva15

	                          ,CAST(ncp.totalDescuento as numeric(18,2))         as descuento
	                          ,CAST(ncp.total as numeric(18,2))                  as total
							  ,ncp.usuario
                              ,ncp.servicioSri as estado
						FROM Ventas.v_NotaCredito      ncp WITH (NOLOCK)
                        WHERE ncp.idEntidad = @idEntidad '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND ncp.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND ncp.idPuntoEmision = @idPuntoEmision '
                END

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(ncp.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END

            IF @codEstado >= 0
                BEGIN
                    IF @codEstado IN (4,6)
                        BEGIN
                            SET @sql = @sql + 'AND ncp.codServicio = @codEstado '
                        END
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND ncp.codServicio != 4'
                        END
                END

            IF @identificacion IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND ncp.identificacionComprador = @identificacion '
                END

            IF @idUsuario IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND ncp.idUsuario = @idUsuario '
                END

            SET @sql = @sql + 'ORDER BY ncp.fechaEmision DESC '

            SELECT entidad as razonSocial
                  ,rucEmpresa as ruc
                  ,telefono
                  ,nombreUsuario as usuario
                  ,'Reporte Tributario - Nota de Credito ' as nombreReporte
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
            FROM v_usuario
            WHERE idUsuarioRol = @idUsuarioRol

            EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@idPuntoEmision = @idPuntoEmision
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@codEstado      = @codEstado
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario


        END

    --> Liquidacion
    IF @tipo = 4
        BEGIN

            SELECT @codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@codEstado      = codEstado
                  ,@identificacion = identificacion
                  ,@idUsuario      = idUsuario
            FROM OPENJSON(@json) WITH
            (
                codEstab       VARCHAR(100)
               ,idPuntoEmision INT
               ,ckFecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,codEstado      INT
               ,identificacion VARCHAR(20)
               ,idUsuario      INT
            )

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@idPuntoEmision  INT
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@codEstado       INT
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            SET @sql = 'SELECT es.nombreComercial
                              ,es.idEstablecimiento
                              ,lc.claveAcceso
                              ,dbo.AFTGenerarNroDocumento(es.estab+pt.ptoEmi,lc.secuencial) as serieComprobante
                              ,Format(lc.fechaEmision,''dd/MM/yyyy'')                       as fechaEmision
                              ,Format(fechaAutorizacion,''dd/MM/yyyy  HH:mm'')              as fechaAutorizacion
                              ,lc.identificacionProveedor
                              ,lc.razonSocialProveedor
                              ,ISNULL((
                                    SELECT CAST(SUM(li.TaxBase) AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId      = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje   = ''7''
                                      AND li.[Enabled]   = 1
                              ),0)                                                          as subTotalExento

                              ,ISNULL((
                                    SELECT CAST(SUM(li.TaxBase) AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId      = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje     = ''6''
                                      AND li.[Enabled]   = 1
                              ),0)                                                          as subTotalNoObjetoIva

                              ,ISNULL((
                                    SELECT CAST(SUM(li.TaxBase) AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId      = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje     = ''5''
                                      AND li.[Enabled]   = 1
                              ),0)                                                          as subTotalIvaCinco

                              ,ISNULL((
                                    SELECT CAST(SUM(li.TaxBase) AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId      = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje     = ''4''
                                      AND li.[Enabled]   = 1
                              ),0)                                                          as subTotalIvaQuince

                              ,ISNULL((
                                    SELECT CAST(SUM(li.TaxBase) AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId      = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje     = ''0''
                                      AND li.[Enabled]   = 1
                              ),0) as subTotalIvaCero

                              ,ISNULL((
                                    SELECT CAST(SUM(li.TaxBase) AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId      = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje   = ''2''
                                      AND li.[Percent] > 0
                                      AND li.[Enabled]   = 1
                               ),0) as subTotalIva

                               ,CAST(lc.subTotalSinImpuestos    AS NUMERIC(18,2))  as precioTotalSinImpuestos

                               ,ISNULL((
                                    SELECT CAST(SUM(li.TaxValue)    AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId          = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje       = ''2''
                                      AND li.[Enabled]   = 1
                               ),0) AS iva

                               ,ISNULL((
                                    SELECT CAST(SUM(li.TaxValue)    AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId          = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje       = ''5''
                                      AND li.[Enabled]   = 1
                               ),0) AS iva5

                               ,ISNULL((
                                    SELECT CAST(SUM(li.TaxValue)    AS NUMERIC(18,2))
                                    FROM Compra.v_LiquidacionImpuesto li
                                    WHERE li.LiquidacionId          = lc.idLiquidacionCompra
                                      AND li.codigoPorcentaje       = ''4''
                                      AND li.[Enabled]   = 1
                               ),0) as iva15

                               ,CAST(lc.totalDescuento as numeric(18,2))         as descuento
                               ,CAST(lc.total as numeric(18,2))                  as total
                               ,us.nombreUsuario                                 as usuario
                               ,CASE WHEN codEstado = 4 THEN ''Autorizada''
                                     WHEN codEstado = 6 THEN ''Anulada''
                                                        ELSE ''No Autorizada''
                                END as estado
                        FROM Compra.v_Liquidacion       lc WITH (NOLOCK)
                        INNER JOIN PuntoEmision         pt WITH (NOLOCK) ON pt.idPuntoEmision    = lc.idPuntoEmision
                        INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento
                        INNER JOIN Usuario              us WITH (NOLOCK) ON us.idUsuario	     = lc.idUsuario
                        WHERE lc.idEntidad = @idEntidad '

            IF LEN(@codEstab) > 5
                BEGIN
                    SET @sql = @sql + 'AND es.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND lc.idPuntoEmision = @idPuntoEmision '
                END

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(lc.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END

            IF @codEstado >= 0
                BEGIN
                    IF @codEstado IN (4,6)
                        BEGIN
                            SET @sql = @sql + 'AND lc.codEstado = @codEstado '
                        END
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND lc.codEstado != 4'
                        END
                END

            IF @identificacion IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND lc.identificacionProveedor = @identificacion '
                END

            IF @idUsuario IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND lc.idUsuario = @idUsuario '
                END

            SET @sql = @sql + 'ORDER BY lc.fechaEmision DESC '

            SELECT entidad as razonSocial
                  ,rucEmpresa as ruc
                  ,telefono
                  ,nombreUsuario as usuario
                  ,'Reporte Tributario - Liquidaci�n ' as nombreReporte
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
            FROM v_usuario
            WHERE idUsuarioRol = @idUsuarioRol

            EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@idPuntoEmision = @idPuntoEmision
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@codEstado      = @codEstado
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario
            RETURN


        END

    --> Retencion
    IF @tipo = 5
        BEGIN
            SELECT @codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@codEstado      = codEstado
                  ,@identificacion = identificacion
                  ,@idUsuario      = idUsuario
            FROM OPENJSON(@json) WITH
            (
                codEstab       VARCHAR(100)
               ,idPuntoEmision INT
               ,ckFecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,codEstado      INT
               ,identificacion VARCHAR(20)
               ,idUsuario      INT
            )

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@idPuntoEmision  INT
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@codEstado       INT
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            SET @sql = 'SELECT de.idEstablecimiento
                              ,de.nombreComercial
	                          ,de.serieComprobante                                as serieComprobante
	                          ,FORMAT(de.fechaEmision,''dd/MM/yyyy'')             as fechaEmision
                              ,Format(de.fechaAutorizacion,''dd/MM/yyyy  HH:mm'') as fechaAutorizacion
	                          ,de.claveAcceso
	                          ,de.rucReceptor                                     as identificacionSujetoRetenido
	                          ,de.razonSocial                                     as razonSocialSujetoRetenido

	                          ,ISNULL(CASE versionComp WHEN ''2.0.0'' THEN (
                                                                                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                                                    FROM FactElect.RetencionAts            ra WITH (NOLOCK)
			                                                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = ra.idRetencionAts
			                                                                    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = ra.idRetencionAts
                                                                                INNER JOIN Sri.ImpuestoRetencion irt WITH(NOLOCK) ON ir.impuestoRetencionId = irt.Id
			                                                                    WHERE ra.idRetencionAts = rt.idRetencionAts
	 			                                                                  AND rt.anuladaSri = 0
				                                                                  AND irt.Codigo = 1
                                                                                  AND ds.estado = 1
												                           )
			                         END
                              ,0) as retRenta

	                          ,ISNULL(CASE versionComp WHEN ''2.0.0'' THEN (
                                                                                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                                                    FROM FactElect.RetencionAts            ra WITH (NOLOCK)
			                                                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = ra.idRetencionAts
			                                                                    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = ra.idRetencionAts
                                                                                INNER JOIN Sri.ImpuestoRetencion irt WITH(NOLOCK) ON ir.impuestoRetencionId = irt.Id
			                                                                    WHERE ra.idRetencionAts = rt.idRetencionAts
	 			                                                                  AND rt.anuladaSri = 0
				                                                                  AND irt.Codigo = 2
                                                                                  AND ds.estado = 1
												                           )
			                          END
                              ,0) as retIva
	                          ,ISNULL(CASE versionComp WHEN ''2.0.0'' THEN (
													                            SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                                                    FROM FactElect.RetencionAts            ra WITH (NOLOCK)
			                                                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = ra.idRetencionAts
			                                                                    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = ra.idRetencionAts
			                                                                    WHERE ra.idRetencionAts = rt.idRetencionAts
	 			                                                                  AND rt.anuladaSri = 0
                                                                                  AND ds.estado = 1
												                           )
			                          END
                              ,0) as totalRet
	                          ,CASE versionComp WHEN ''2.0.0'' THEN (
											                            SELECT TOP 1 SUBSTRING(ds.numDocSustento,1,3) + ''-'' + SUBSTRING(ds.numDocSustento,4,3) + ''-'' + SUBSTRING(ds.numDocSustento,7,9)
			                                                            FROM FactElect.RetencionAts            ra WITH (NOLOCK)
			                                                            INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = ra.idRetencionAts
			                                                            INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = ra.idRetencionAts
			                                                            WHERE ra.idRetencionAts = rt.idRetencionAts
	 			                                                            AND rt.anuladaSri = 0
                                                                            AND ds.estado = 1
										                            )
	                           END as numDocSustento

	                          ,CASE versionComp WHEN ''2.0.0'' THEN (
                                                                        SELECT TOP 1 FORMAT(ds.fechaEmisionDocSustento,''dd/MM/yyyy'')
			                                                            FROM FactElect.RetencionAts            ra WITH (NOLOCK)
			                                                            INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = ra.idRetencionAts
			                                                            INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = ra.idRetencionAts
			                                                            WHERE ra.idRetencionAts = rt.idRetencionAts
	 			                                                            AND rt.anuladaSri = 0
                                                                            AND ds.estado = 1
										                            )
	                         END as fechaEmisionDocSustento

	                        ,de.usuario
	                        ,CASE WHEN de.codEstado = 4 THEN ''Autorizada''
                                  WHEN de.codEstado = 6 THEN ''Anulada''
                                                        ELSE ''No Autorizada''
                             END as estado
                            ,de.versionComp
                    FROM FactElect.v_DocElectronico   de WITH (NOLOCK)
                    INNER JOIN FactElect.RetencionAts rt WITH (NOLOCK) ON rt.idDocumentoElectronico = de.idDocumentoElectronico
                    WHERE de.codDoc = ''07''
                      AND de.idEntidad = @idEntidad '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND de.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND de.idPuntoEmision = @idPuntoEmision '
                END

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(de.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END

            IF @codEstado >= 0
                BEGIN
                    IF @codEstado IN (4,6)
                        BEGIN
                            SET @sql = @sql + 'AND de.codEstado = @codEstado '
                        END
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND de.codEstado != 4'
                        END
                END

            IF @identificacion IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND de.rucReceptor = @identificacion '
                END

            IF @idUsuario IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND de.idUsuario = @idUsuario '
                END

            SET @sql = @sql + 'ORDER BY de.idEstablecimiento,de.CustomerId,de.fechaEmision DESC '

            SELECT entidad as razonSocial
                  ,rucEmpresa as ruc
                  ,telefono
                  ,nombreUsuario as usuario
                  ,'Reporte Tributario - Comprobante de Retenci�n ' as nombreReporte
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
            FROM v_usuario
            WHERE idUsuarioRol = @idUsuarioRol

            EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@idPuntoEmision = @idPuntoEmision
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@codEstado      = @codEstado
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario


        END

    --> Guia Remision
    IF @tipo = 6
        BEGIN
            SELECT @codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@codEstado      = codEstado
                  ,@identificacion = identificacion
                  ,@idUsuario      = idUsuario
            FROM OPENJSON(@json) WITH
            (
                codEstab       VARCHAR(100)
               ,idPuntoEmision INT
               ,ckFecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,codEstado      INT
               ,identificacion VARCHAR(20)
               ,idUsuario      INT
            )

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@idPuntoEmision  INT
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@codEstado       INT
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            SET @sql = 'SELECT et.idEstablecimiento
                              ,et.nombreComercial
                              ,de.serieComprobante
                              ,de.claveAcceso
                              ,Format(de.fechaAutorizacion,''dd/MM/yyyy  HH:mm'') as fechaAutorizacion
                              ,FORMAT(de.fechaEmision,''dd/MM/yyyy'')             as fechaEmision
	                          ,cu.IdCard		                                  as identificacion
	                          ,cu.BusinessName	                                  as cliente
	                          ,es.descripcion                                     as estado
	                          ,gr.ptoPartida
	                          ,gr.ptoLlegada
	                          ,gr.motivo
	                          ,tr.nombre	                                      as transportista
	                          ,ve.placa		                                      as vehiculo
	                          ,CASE WHEN gr.idFactura > 0        THEN ''FE''
	                                WHEN gr.idNotaEntrega > 0    THEN ''NE''
			                        WHEN gr.idAprob_Document > 0 THEN ''PF''
 	                           END				                                  as tipoDoc
	                          ,CASE WHEN gr.idFactura > 0        THEN df.serieComprobante
	                                WHEN gr.idNotaEntrega > 0    THEN ne.serieComprobante
			                        WHEN gr.idAprob_Document > 0 THEN ad.serieComprobante
 	                           END				                                  as serieDocumento
                              ,ur.nombreUsuario	                                  as usuario
                        FROM dbo.GuiaRemision			    gr WITH (NOLOCK)
                        INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = gr.idDocumentoElectronico
                        INNER JOIN dbo.Cliente				cl WITH (NOLOCK) ON cl.idCliente              = gr.idCliente
                        INNER JOIN dbo.Transportista        tr WITH (NOLOCK) ON tr.idTransportista        = gr.idTransportista
                        INNER JOIN dbo.Vehiculo             ve WITH (NOLOCK) ON ve.idVehiculo			  = gr.idVehiculo
                         LEFT JOIN dbo.Factura              fa WITH (NOLOCK) ON fa.idFactura		      = gr.idFactura
                         LEFT JOIN dbo.NotaEntrega          ne WITH (NOLOCK) ON ne.idNotaEntrega		  = gr.idNotaEntrega
                         LEFT JOIN Ventas.Aprob_Document    ad WITH (NOLOCK) ON ad.idAprob_Document		  = gr.idAprob_Document
                        INNER JOIN dbo.Usuario			    ur WITH (NOLOCK) ON ur.idUsuario		      = gr.idUsuario
                        INNER JOIN Customer.Customer		cu WITH (NOLOCK) ON cu.Id					  = cl.CustomerId
                        INNER JOIN factElect.EstadoServicio es WITH (NOLOCK) ON es.idEstadoServicio		  = de.idEstadoServicio
                        INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision	      = de.idPuntoEmision
                        INNER JOIN Sri.Establecimiento      et WITH (NOLOCK) ON et.idEstablecimiento      = pe.idEstablecimiento
                         LEFT JOIN dbo.DocumentoElectronico df WITH (NOLOCK) ON df.idDocumentoElectronico = fa.idDocumentoElectronico
                        WHERE et.idEntidad = @idEntidad '

            IF LEN(@codEstab) > 5
                BEGIN
                    SET @sql = @sql + 'AND et.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND de.idPuntoEmision = @idPuntoEmision '
                END

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(de.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END

            IF @codEstado >= 0
                BEGIN
                    IF @codEstado IN (4,6)
                        BEGIN
                            SET @sql = @sql + 'AND es.codigo = @codEstado '
                        END
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND es.codigo != 4'
                        END
                END

            IF @identificacion IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND cu.IdCard = @identificacion '
                END

            IF @idUsuario IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND gr.idUsuario = @idUsuario '
                END

            SET @sql = @sql + 'ORDER BY de.fechaEmision DESC '

            SELECT entidad as razonSocial
                  ,rucEmpresa as ruc
                  ,telefono
                  ,nombreUsuario as usuario
                  ,'Reporte Tributario - Gu�a de Remisi�n ' as nombreReporte
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
            FROM v_usuario
            WHERE idUsuarioRol = @idUsuarioRol

            EXEC sp_executesql @sql
							  ,@params
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@idPuntoEmision = @idPuntoEmision
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@codEstado      = @codEstado
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario
            RETURN
        END

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    END TRY

    BEGIN CATCH

          -- Log error details
        INSERT INTO dbo.ErroresSistema
        ([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES ('Reports/ReporteTributario', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), 'FactElect.Doc_Elect_Report', ERROR_LINE(), ERROR_MESSAGE(), @idUsuario);
        THROW;
    END CATCH
END
