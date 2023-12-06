USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaEntrega WITH SCHEMABINDING AS (

	SELECT ne.idNotaEntrega
		  ,ne.nroDocumento						   as secuencial
		  ,ne.fechaEmision                         as fechaEmision
          ,ne.idEntidad
          ,ne.idTipoDocumento
		  ,ne.idPuntoEmision
          ,ne.idCliente
          ,ne.idUsuario
		  ,es.estab
          ,es.nombreComercial
          ,es.idEstablecimiento
          ,pe.codEstab
		  ,pe.ptoEmi
          ,cl.nombreFiscal as razonSocialComprador
          ,cl.numeroIdentificacion as identificacionComprador
		  ,subTotalSinImpuestos
		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '2'
           ),0) as subTotalIva

          ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '2'
           ),0) as subTotalNetoIva

		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '0'
           ),0) as subTotalIvaCero

		  ,ISNULL((
            SELECT SUM(TaxBase ) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '0'
           ),0) as subTotalNetoIvaCero

		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '6'
           ),0) as subTotalNoObjetoIva

		  ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '6'
           ),0) as subTotalNetoNoObjetoIva

		  ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '7'
           ),0) as subTotalExentoIva


		  ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '7'
           ),0) as subTotalNetoExentoIva

           ,ISNULL((
            SELECT SUM(TaxBase + Discount) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '8'
           ),0) as subTotalIva8

          ,ISNULL((
            SELECT SUM(TaxBase) 
            FROM Ventas.NotaEntregaImpuesto ni WITH (NOLOCK) 
            INNER JOIN dbo.Impuesto         im WITH (NOLOCK) ON im.idImpuesto = ni.TaxId
            INNER JOIN dbo.TipoIva          ti WITH (NOLOCK) ON ti.idTipoIva  = ni.TaxPercentId
            WHERE ni.NotaEntregaId = ne.idNotaEntrega AND im.codigo = '2' AND ti.codigoPorcentaje = '8'
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
		  ,ISNULL(ne.observacion, '')       as observacion
		  ,IIF(ne.tarifa != 12,'8','2') as codigoPorcentaje
		  ,ne.tarifa
          ,ne.estado 
          ,us.nombreUsuario
	FROM dbo.NotaEntrega                    ne WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision
	INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab       = pe.codEstab 
    INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente      = ne.idCliente
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario      = ne.idUsuario

)