USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaCredito WITH SCHEMABINDING AS (

  SELECT nc.idNotaCredito
        ,nc.idFactura
        ,nc.idCliente
        ,nc.idPuntoEmision
        ,nc.idEntidad
        ,nc.idUsuario
        ,nc.nroDocumento as secuencial
        ,nc.subTotalSinImpuestos
        ,nc.fechaEmision
        ,nc.fechaAutorizacion
        ,nc.claveAcceso
        ,nc.emision
        ,ISNULL((
                CASE WHEN nc.codigoPorcentaje = '2' THEN (
                                                            SELECT SUM(TaxBase + Discount) 
                                                            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
                                                            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
                                                            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
                                                            WHERE ni.NotaCreditoId = nc.idNotaCredito 
                                                                AND im.codigo = '2' 
                                                                AND ti.codigoPorcentaje = '2'
                                                            )
                        WHEN nc.codigoPorcentaje = '8' THEN (
                                                            SELECT SUM(TaxBase + Discount) 
                                                            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
                                                            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
                                                            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
                                                            WHERE ni.NotaCreditoId = nc.idNotaCredito 
                                                                AND im.codigo = '2' 
                                                                AND ti.codigoPorcentaje = '8'
                                                            )
                END 
        ),0) as subTotalIva

        ,ISNULL((
                CASE WHEN nc.codigoPorcentaje = '2' THEN (
                                                            SELECT SUM(TaxBase) 
                                                            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
                                                            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
                                                            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
                                                            WHERE ni.NotaCreditoId = nc.idNotaCredito 
                                                                AND im.codigo = '2' 
                                                                AND ti.codigoPorcentaje = '2'
                                                            )
                        WHEN nc.codigoPorcentaje = '8' THEN (
                                                            SELECT SUM(TaxBase) 
                                                            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
                                                            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
                                                            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
                                                            WHERE ni.NotaCreditoId = nc.idNotaCredito 
                                                                AND im.codigo = '2' 
                                                                AND ti.codigoPorcentaje = '8'
                                                            )
                END 
        ),0) as subTotalNetoIva

        ,ISNULL
        ((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaCreditoId = nc.idNotaCredito AND im.codigo = '2' AND ti.codigoPorcentaje = '0'

        ),0) as subTotalIvaCero

        ,ISNULL
        ((
            SELECT SUM(TaxBase ) 
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaCreditoId = nc.idNotaCredito AND im.codigo = '2' AND ti.codigoPorcentaje = '0'

        ),0) as subTotalNetoIvaCero

        ,ISNULL
        ((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaCreditoId = nc.idNotaCredito AND im.codigo = '2' AND ti.codigoPorcentaje = '6'

        ),0) as subTotalNoObjetoIva

        ,ISNULL
        ((
            SELECT SUM(TaxBase) 
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaCreditoId = nc.idNotaCredito AND im.codigo = '2' AND ti.codigoPorcentaje = '6'

        ),0) as subTotalNetoNoObjetoIva

        ,ISNULL
        ((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaCreditoId = nc.idNotaCredito AND im.codigo = '2' AND ti.codigoPorcentaje = '7'

        ),0) as subTotalExentoIva

        ,ISNULL
        ((
            SELECT SUM(TaxBase) 
            FROM Ventas.NotaCreditoImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaCreditoId = nc.idNotaCredito AND im.codigo = '2' AND ti.codigoPorcentaje = '7'

        ),0) as subTotalNetoExentoIva
        ,nc.iva
        ,0 as totalIce
        ,nc.totalDescuento
        ,nc.porcentajeDescuento
        ,nc.total
        ,nc.irbpnr
        ,nc.propina
        ,nc.estado
        ,nc.observacion
        ,nc.codigoPorcentaje
        ,nc.tarifa
        ,pt.ptoEmi
        ,es.idEstablecimiento
        ,es.codEstab
        ,es.nombreComercial
        ,es.estab
        ,cl.nombreFiscal as razonSocialComprador
        ,cl.numeroIdentificacion as  identificacionComprador
        ,(SELECT de.codEstado FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.codDoc = '04' AND de.idDocumento = nc.idNotaCredito ) as codEstado
	FROM dbo.NotaCredito           nc WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = nc.idPuntoEmision
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
    INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = nc.idCliente

)