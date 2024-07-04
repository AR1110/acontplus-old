USE AcontPlus
GO
CREATE OR ALTER VIEW Compra.v_Liquidacion WITH SCHEMABINDING AS (

  SELECT lc.idLiquidacionCompra
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
        ,de.nroDocumento         as secuencial
        ,pt.ptoEmi
        ,es.idEntidad
        ,es.idEstablecimiento
        ,es.codEstab
        ,es.nombreComercial
        ,es.estab
        ,pr.nombreFiscal         as razonSocialProveedor
        ,pr.numeroIdentificacion as identificacionProveedor
        ,se.codigo               as codEstado
	FROM dbo.LiquidacionCompra          lc WITH (NOLOCK)
    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = lc.idDocumentoElectronico
    INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor            = lc.idProveedor
    INNER JOIN dbo.PuntoEmision         pt WITH (NOLOCK) ON pt.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pt.idEstablecimiento
    INNER JOIN FactElect.EstadoServicio se WITH (NOLOCK) ON se.idEstadoServicio       = de.idEstadoServicio
)