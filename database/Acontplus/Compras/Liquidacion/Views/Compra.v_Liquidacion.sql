USE AcontPlus
GO
CREATE OR ALTER VIEW Compra.v_Liquidacion WITH SCHEMABINDING AS (

  SELECT lc.idLiquidacionCompra
        ,lc.idProveedor
        ,lc.idPuntoEmision
        ,lc.idEntidad
        ,lc.idUsuario
        ,lc.nroDocumento as secuencial
        ,lc.subTotalSinImpuestos
        ,lc.fechaEmision
        ,lc.fechaAutorizacion
        ,lc.claveAcceso
        ,lc.emision
        ,0 as totalIce
        ,lc.totalDescuento
        ,lc.porcentajeDescuento
        ,lc.total
        ,lc.propina
        ,lc.estado
        ,lc.observacion
        ,pt.ptoEmi
        ,es.idEstablecimiento
        ,es.codEstab
        ,es.nombreComercial
        ,es.estab
        ,pr.nombreFiscal         as razonSocialProveedor
        ,pr.numeroIdentificacion as identificacionProveedor
        ,(SELECT de.codEstado FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.codDoc = '03' AND de.idDocumento = lc.idLiquidacionCompra ) as codEstado
	FROM dbo.LiquidacionCompra     lc WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = lc.idPuntoEmision
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
    INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor    = lc.idProveedor
)