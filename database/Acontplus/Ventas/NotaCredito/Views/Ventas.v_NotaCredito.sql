USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaCredito WITH SCHEMABINDING AS (
  SELECT nc.idNotaCredito
        ,nc.idFactura
        ,nc.idCliente
        ,nc.idPuntoEmision
        ,nc.idEntidad
        ,nc.idUsuario
        ,nc.nroDocumento         as secuencial
        ,nc.subTotalSinImpuestos
        ,nc.fechaEmision
        ,nc.fechaAutorizacion
        ,nc.claveAcceso
        ,nc.emision
        ,0                       as totalIce
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
        ,cl.nombreFiscal         as razonSocialComprador
        ,cl.numeroIdentificacion as identificacionComprador
        ,cc.idEstadoPago
        ,ep.descripcion          as estadoCuenta
        ,ep.codigo               as codCuenta
        ,sf.codigo               as codServicio
        ,sf.descripcion          as servicioSri
        ,us.nombreUsuario        as usuario
        ,es.estab + '-' + pt.ptoEmi + '-' + RIGHT('000000000' + CAST(nc.nroDocumento AS VARCHAR(9)), 9) as serieComprobante
        ,ef.estab + '-' + pf.ptoEmi + '-' + RIGHT('000000000' + CAST(fe.nroFactura AS VARCHAR(9)), 9)   as numDocSustento
	FROM dbo.NotaCredito                    nc WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision             pt WITH (NOLOCK) ON pt.idPuntoEmision   = nc.idPuntoEmision
    INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente        = nc.idCliente
    INNER JOIN dbo.Factura                  fe WITH (NOLOCK) ON fe.idFactura        = nc.idFactura
    INNER JOIN dbo.Usuario                  us WITH (NOLOCK) ON us.idUsuario        = nc.idUsuario
     LEFT JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idDocumento      = nc.idNotaCredito AND cc.codDoc = '04'
     LEFT JOIN dbo.DocumentoElectronico     de WITH (NOLOCK) ON de.idDocumento      = nc.idNotaCredito AND de.codDoc = '04'
    INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab         = pt.codEstab
     LEFT JOIN dbo.EstadoPago               ep WITH (NOLOCK) ON ep.idEstadoPago     = cc.idEstadoPago 
     LEFT JOIN FactElect.EstadoServicio     sf WITH (NOLOCK) ON sf.idEstadoServicio = de.idEstadoServicio
    INNER JOIN dbo.PuntoEmision             pf WITH (NOLOCK) ON pf.idPuntoEmision   = fe.idPuntoEmision
    INNER JOIN Sri.Establecimiento          ef WITH (NOLOCK) ON ef.codEstab         = pf.codEstab

)