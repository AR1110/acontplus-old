USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaCredito WITH SCHEMABINDING AS (
  SELECT nc.idNotaCredito
        ,nc.idFactura
        ,nc.idCliente
        ,nc.idUsuario
        ,nc.subTotalSinImpuestos
        ,nc.emision
        ,0                       as totalIce
        ,nc.totalDescuento
        ,nc.porcentajeDescuento
        ,nc.total
        ,nc.propina
        ,nc.estado
        ,nc.observacion
        ,pt.ptoEmi
        ,es.idEntidad
        ,es.idEstablecimiento
        ,es.codEstab
        ,es.nombreComercial
        ,es.estab
        ,cu.BusinessName         as razonSocialComprador
        ,cu.IDCard               as identificacionComprador
        ,cc.idEstadoPago
        ,ep.descripcion          as estadoCuenta
        ,ep.codigo               as codCuenta
        ,sf.codigo               as codServicio
        ,sf.descripcion          as servicioSri
        ,us.nombreUsuario        as usuario
        ,de.idPuntoEmision
        ,de.nroDocumento         as secuencial
        ,de.serieComprobante
        ,de.fechaEmision
        ,de.fechaAutorizacion
        ,de.claveAcceso
        ,df.seriecomprobante     as numDocSustento
	FROM dbo.NotaCredito                    nc WITH (NOLOCK)
    INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente              = nc.idCliente
    INNER JOIN dbo.Factura                  fe WITH (NOLOCK) ON fe.idFactura              = nc.idFactura
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario              = nc.idUsuario
    INNER JOIN dbo.DocumentoElectronico     de WITH (NOLOCK) ON de.idDocumentoElectronico = nc.idDocumentoElectronico
     LEFT JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idDocumento            = nc.idNotaCredito AND cc.codDoc = '04'
    INNER JOIN dbo.PuntoEmision             pt WITH (NOLOCK) ON pt.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.idEstablecimiento      = pt.idEstablecimiento
     LEFT JOIN dbo.EstadoPago               ep WITH (NOLOCK) ON ep.idEstadoPago           = cc.idEstadoPago 
     LEFT JOIN FactElect.EstadoServicio     sf WITH (NOLOCK) ON sf.idEstadoServicio       = de.idEstadoServicio
    INNER JOIN dbo.DocumentoElectronico     df WITH (NOLOCK) ON df.idDocumentoElectronico = fe.idDocumentoElectronico
    INNER JOIN Customer.Customer            cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId

)