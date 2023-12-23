USE AcontPlus
GO

CREATE OR ALTER VIEW v_CuentaPorPagar AS (
	SELECT cp.idCuentaPorPagar
	      ,cp.idProveedor
		  ,cp.idTiempoCredito
		  ,cp.idEstadoPago
		  ,cp.idUsuario
		  ,cp.idEntidad
		  ,cp.idDocumento
          ,CASE WHEN cp.codDoc = '03' THEN (SELECT TOP 1 lc.idPuntoEmision 
                                            FROM dbo.LiquidacionCompra lc WITH (NOLOCK) 
                                            WHERE lc.idLiquidacionCompra = cp.idDocumento)
           END as idPuntoEmision
		  ,es.codEstab
		  ,cp.codDoc
		  ,cp.uniqueId
		  ,razonSocialProveedor = pr.nombreFiscal
		  ,identificacionProveedor = pr.numeroIdentificacion
		  ,cp.serieComprobante
		  ,secuencial = REPLACE(LTRIM(REPLACE(SUBSTRING(cp.serieComprobante,9,9),'0',' ')),' ','0')
		  ,cp.fechaEmision
		  ,cp.fechaVencimiento
		  ,cp.importeTotal
		  ,cp.abono
		  ,cp.saldo
		  ,estado                  = ep.descripcion
		  ,codEstado               = ep.codigo
		  ,estadoSri               = CASE WHEN cp.codDoc = '03' THEN (SELECT de.codEstado FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.idDocumento = cp.idDocumento AND de.codDoc = '03') 
		                                                         ELSE 0 END 
		  ,usuario = us.nombreUsuario
          ,tc.descripcion as tiempoCredito
	FROM Contabilidad.CuentaPorPagar cp WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento = cp.idEstablecimiento 
	INNER JOIN Proveedor             pr WITH (NOLOCK) ON pr.idProveedor       = cp.idProveedor
	INNER JOIN EstadoPago            ep WITH (NOLOCK) ON ep.idEstadoPago      = cp.idEstadoPago
	INNER JOIN Usuario               us WITH (NOLOCK) ON us.idUsuario         = cp.idUsuario
     LEFT JOIN TiempoCredito         tc WITH (NOLOCK) ON tc.idTiempoCredito   = cp.idTiempoCredito
)