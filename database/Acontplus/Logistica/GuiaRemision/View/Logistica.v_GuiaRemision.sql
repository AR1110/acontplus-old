USE AcontPlus
GO
CREATE OR ALTER VIEW Logistica.v_GuiaRemision WITH SCHEMABINDING AS (

  SELECT gr.idGuiaRemision
        ,gr.idCliente
        ,gr.idUsuario
        ,gr.idFactura
        ,gr.fechaInicio
        ,gr.fechaFin
        ,gr.emision
        ,gr.estado
        ,gr.docAduanero
		,gr.ptoPartida
		,gr.ptoLlegada
        ,pt.ptoEmi
        ,gr.ruta
		,gr.estableDestino
		,gr.entregar
        ,gr.motivo
        ,de.nroDocumento as secuencial
        ,de.idPuntoEmision
        ,de.fechaEmision
        ,de.fechaAutorizacion
        ,de.claveAcceso
        ,de.serieComprobante
        ,es.idEntidad
        ,es.idEstablecimiento
        ,es.codEstab
        ,es.nombreComercial
        ,es.estab
        ,pt.ambiente
        ,cl.nombreFiscal         as razonSocialDestinatario
        ,cl.numeroIdentificacion as identificacionDestinatario
        ,se.codigo               as codEstado
        ,ts.nombre               as razonSocialTransportista
        ,us.nombreUsuario        as usuario
        ,df.serieComprobante     as numDocSustento
	FROM dbo.GuiaRemision               gr WITH (NOLOCK)
    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = gr.idDocumentoElectronico
    INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = gr.idCliente
    INNER JOIN dbo.Transportista        ts WITH (NOLOCK) ON ts.idTransportista        = gr.idTransportista
    INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario              = gr.idUsuario
     LEFT JOIN dbo.Factura              fa WITH (NOLOCK) ON fa.idFactura              = gr.idFactura
    INNER JOIN dbo.PuntoEmision         pt WITH (NOLOCK) ON pt.idPuntoEmision         = de.idPuntoEmision
    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pt.idEstablecimiento
    INNER JOIN FactElect.EstadoServicio se WITH (NOLOCK) ON se.idEstadoServicio       = de.idEstadoServicio
     LEFT JOIN dbo.DocumentoElectronico df WITH (NOLOCK) ON df.idDocumentoElectronico = fa.idDocumentoElectronico
)