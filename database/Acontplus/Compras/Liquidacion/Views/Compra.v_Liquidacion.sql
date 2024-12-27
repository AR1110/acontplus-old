USE AcontPlus
GO
CREATE OR ALTER VIEW Compra.v_Liquidacion WITH SCHEMABINDING AS (

  SELECT lc.idLiquidacionCompra
        ,lc.idDocumentoElectronico
        ,lc.idProveedor
        ,lc.idUsuario
        ,lc.subTotalSinImpuestos
        ,lc.emision
        ,0 as totalIce
        ,lc.totalDescuento
        ,lc.porcentajeDescuento
        ,lc.total
        ,lc.propina
        ,lc.recargo
        ,lc.transporte
        ,lc.estado
        ,lc.observacion
        ,de.idPuntoEmision
        ,de.fechaEmision
        ,de.claveAcceso
        ,de.fechaAutorizacion
        ,de.nroDocumento      as secuencial
        ,de.serieComprobante
        ,cp.subcategoryId
        ,pt.ptoEmi
        ,es.idEntidad
        ,es.idEstablecimiento
        ,es.codEstab
        ,es.nombreComercial
        ,es.estab
        ,cu.BusinessName      as razonSocialProveedor
        ,cu.IDCard            as identificacionProveedor
        ,se.codigo            as codEstado
        ,cp.abono
        ,cp.saldo
        ,ep.descripcion       as estadoCuenta
        ,ep.codigo            as codCuenta
        ,us.nombreUsuario     as usuario
	FROM dbo.LiquidacionCompra             lc WITH (NOLOCK)
    INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = lc.idDocumentoElectronico
    INNER JOIN dbo.Proveedor               pr WITH (NOLOCK) ON pr.idProveedor            = lc.idProveedor
    INNER JOIN dbo.Usuario                 us WITH (NOLOCK) ON us.idUsuario              = lc.idUsuario
    INNER JOIN Contabilidad.CuentaPorPagar cp WITH (NOLOCK) ON cp.idDocumento            = lc.idLiquidacionCompra AND cp.codDoc = '03'
    INNER JOIN dbo.PuntoEmision            pt WITH (NOLOCK) ON pt.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN Sri.Establecimiento         es WITH (NOLOCK) ON es.idEstablecimiento      = pt.idEstablecimiento
    INNER JOIN FactElect.EstadoServicio    se WITH (NOLOCK) ON se.idEstadoServicio       = de.idEstadoServicio
     LEFT JOIN dbo.EstadoPago              ep WITH (NOLOCK) ON ep.idEstadopago           = cp.idEstadoPago
    INNER JOIN Customer.Customer           cu WITH (NOLOCK) ON cu.Id                     = pr.CustomerId
)