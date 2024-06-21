USE AcontPlus
GO 

CREATE OR ALTER VIEW v_CuentaPorCobrar AS (
	SELECT cc.idCuentaPorCobrar
		  ,cc.idDocumento
		  ,cc.idCliente
		  ,cc.idTiempoCredito
		  ,cc.idEntidad
		  ,cc.idPuntoEmision
		  ,cc.idUsuario
		  ,cc.idEstadoPago
		  ,es.idEstablecimiento
          ,idEmpresa                = ISNULL(cl.idEmpresa, 0)
		  ,es.codEstab
          ,es.telefono as telefonoEstablecimiento
		  ,es.nombreComercial
          ,es.dirEstablecimiento 
          ,es.ruc
		  ,cc.codDoc
		  ,cc.serieComprobante
		  ,cc.secuencial
		  ,cc.fechaEmision
		  ,cc.fechaVencimiento
		  ,identificacionComprador = cl.numeroIdentificacion
		  ,razonSocialComprador    = cl.nombreFiscal
		  ,correo                  = cl.correo
		  ,telefono                = cl.telefono
          ,cl.CustomerId
		  ,estado                  = ep.descripcion
		  ,codEstado               = ep.codigo
		  ,cc.importeTotal
		  ,cc.abono
		  ,cc.saldo
          ,cc.diasMora
		  ,usuario                 = us.nombreUsuario
		  ,tiempoCredito           = tc.tipo
          ,tc.descripcion          AS tipoTiempoCredito
		  ,estadoSri               = CASE WHEN cc.codDoc = '01' THEN (
                                                                          SELECT TOP 1 es.codigo 
                                                                          FROM dbo.DocumentoElectronico       de WITH (NOLOCK)
                                                                          INNER JOIN FactElect.EstadoServicio es WITH (NOLOCK) ON es.idEstadoServicio = de.idEstadoServicio
                                                                          WHERE de.idDocumento = cc.idDocumento 
                                                                            AND de.codDoc = '01'
                                                                      ) 
		                                                        ELSE 0 
                                     END     
          ,cc.mora
          ,us.nombreUsuario
          ,CASE WHEN cc.codDoc  = 'NE' THEN (SELECT TOP 1 ne.convertToDoc FROM dbo.NotaEntrega ne WITH (NOLOCK) WHERE ne.idNotaEntrega = cc.idDocumento)
                                       ELSE 0
           END as convertToDoc
	FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
	INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente       = cc.idCliente
	INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago    = cc.idEstadoPago
	INNER JOIN dbo.Usuario            us WITH (NOLOCK) ON us.idUsuario       = cc.idUsuario 
     LEFT JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision  = cc.idPuntoEmision
     LEFT JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab        = pt.codEstab
     LEFT JOIN dbo.TiempoCredito      tc WITH (NOLOCK) ON tc.idTiempoCredito = cc.idTiempoCredito
)