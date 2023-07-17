
USE AcontPlus

IF OBJECT_ID(N'v_CuentaPorCobrar', N'V')IS NOT NULL
	DROP VIEW v_CuentaPorCobrar
GO 

CREATE VIEW v_CuentaPorCobrar AS (
	SELECT cc.idCuentaPorCobrar
		  ,cc.idDocumento
		  ,cc.idCliente
		  ,cc.idTiempoCredito
		  ,cc.idEntidad
		  ,cc.idPuntoEmision
		  ,cc.idUsuario
		  ,cc.idEstadoPago
		  ,es.idEstablecimiento
		  ,es.codEstab
		  ,cc.codDoc
		  ,telefonoEstablecimiento = es.telefono
		  ,es.nombreComercial
		  ,cc.serieComprobante
		  ,cc.secuencial
		  ,cc.fechaEmision
		  ,cc.fechaVencimiento
		  ,identificacionComprador = cl.numeroIdentificacion
		  ,razonSocialComprador    = cl.nombreFiscal
		  ,correo                  = cl.correo
		  ,telefono                = cl.telefono
		  ,estado                  = ep.descripcion
		  ,codEstado               = ep.codigo
		  ,cc.importeTotal
		  ,cc.abono
		  ,cc.saldo
		  ,usuario                 = us.nombreUsuario
		  ,tiempoCredito           = tc.tipo
		  ,estadoSri               = CASE WHEN cc.codDoc = '01' THEN (SELECT de.codEstado FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.idDocumento = cc.idDocumento AND de.codDoc = '01') 
		                                                         ELSE 0 END 
	FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision  = cc.idPuntoEmision
	INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab        = pt.codEstab
	INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente       = cc.idCliente
	INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago    = cc.idEstadoPago
	INNER JOIN dbo.Usuario            us WITH (NOLOCK) ON us.idUsuario       = cc.idUsuario
	INNER JOIN dbo.TiempoCredito      tc WITH (NOLOCK) ON tc.idTiempoCredito = cc.idTiempoCredito
)