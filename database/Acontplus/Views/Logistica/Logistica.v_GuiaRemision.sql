USE AcontPlus
GO
CREATE OR ALTER VIEW Logistica.v_GuiaRemision WITH SCHEMABINDING AS (

  SELECT gr.idGuiaRemision
        ,gr.idCliente
        ,gr.idPuntoEmision
        ,gr.idEntidad
        ,gr.idUsuario
        ,gr.idFactura
        ,gr.nroDocumento as secuencial
        ,gr.fechaEmision
        ,gr.fechaInicio
        ,gr.fechaFin
        ,gr.fechaAutorizacion
        ,gr.claveAcceso
        ,gr.emision
        ,gr.estado
        ,pt.ptoEmi
        ,es.idEstablecimiento
        ,es.codEstab
        ,es.nombreComercial
        ,es.estab
        ,cl.nombreFiscal         as razonSocialDestinatario
        ,cl.numeroIdentificacion as identificacionDestinatario
        ,(SELECT TOP 1 de.codEstado FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.codDoc = '06' AND de.idDocumento = gr.idGuiaRemision ) as codEstado
        ,ef.estab      as estabFac
        ,pf.ptoEmi     as ptoFac
        ,fa.nroFactura as secFac
        ,ts.nombre     as razonSocialTransportista
        ,us.nombreUsuario as usuario
	FROM dbo.GuiaRemision          gr WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision  = gr.idPuntoEmision
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab        = pt.codEstab
    INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente       = gr.idCliente
    INNER JOIN dbo.Transportista   ts WITH (NOLOCK) ON ts.idTransportista = gr.idTransportista
    INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario       = gr.idUsuario
     LEFT JOIN dbo.Factura         fa WITH (NOLOCK) ON fa.idFactura       = gr.idFactura
     LEFT JOIN dbo.PuntoEmision    pf WITH (NOLOCK) ON pf.idPuntoEmision  = fa.idFactura
     LEFT JOIN Sri.Establecimiento ef WITH (NOLOCK) ON ef.codEstab        = pf.codEstab
)