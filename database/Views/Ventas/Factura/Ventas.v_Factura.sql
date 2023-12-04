USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_Factura WITH SCHEMABINDING AS (

	SELECT fa.idFactura
		  ,fa.nroFactura						   as secuencial
		  ,fa.fechaEmision                         as fechaEmision
          ,fa.idEntidad
          ,fa.idTipoDocumento
		  ,fa.idPuntoEmision
          ,fa.idCliente
          ,fa.idUsuario
		  ,es.estab
          ,es.nombreComercial
          ,es.idEstablecimiento
          ,pe.codEstab
		  ,pe.ptoEmi
          ,fa.claveAcceso
          ,fa.emision
          ,fa.fechaAutorizacion
          ,cl.nombreFiscal as razonSocialComprador
          ,cl.numeroIdentificacion as identificacionComprador
		  ,subTotalSinImpuestos
		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '2'
           ),0) as subTotalIva

          ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '2'
           ),0) as subTotalNetoIva

		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '0'
           ),0) as subTotalIvaCero

		  ,ISNULL((
            SELECT SUM(TaxBase ) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '0'
           ),0) as subTotalNetoIvaCero

		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '6'
           ),0) as subTotalNoObjetoIva

		  ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '6'
           ),0) as subTotalNetoNoObjetoIva

		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '7'
           ),0) as subTotalExentoIva


		  ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '7'
           ),0) as subTotalNetoExentoIva

           ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '8'
           ),0) as subTotalIva8

          ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.FacturaImpuesto fi WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
            WHERE FacturaId = fa.idFactura AND im.codigo = '2' AND ti.codigoPorcentaje = '8'
           ),0) as subTotalNetoIva8

		  ,totalDescuento
		  ,porcentajeDescuento
		  ,0 as totalIce
		  ,irbpnr
		  ,propina
		  ,iva
		  ,recargo
		  ,transporte
		  ,total
		  ,ISNULL(fa.observacion, '')       as observacion
		  ,IIF(fa.porcentaje != 12,'8','2') as codigoPorcentaje
		  ,fa.porcentaje                    as tarifa
          ,fa.notaCredito
          ,fa.estado 
          ,fa.autorizada
          ,us.nombreUsuario
          ,(SELECT de.codEstado FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.idDocumentoElectronico = fa.idFactura AND de.codDoc = '01') as codEstado
	FROM dbo.Factura                        fa WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision = fa.idPuntoEmision
	INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab       = pe.codEstab 
    INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente      = fa.idCliente
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario      = fa.idUsuario

)