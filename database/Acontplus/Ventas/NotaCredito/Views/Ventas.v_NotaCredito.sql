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
        ,0 as totalIce
        ,nc.totalDescuento
        ,nc.porcentajeDescuento
        ,nc.total
        ,nc.propina
        ,nc.estado
        ,nc.observacion
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