use acontplus

GO
IF OBJECT_ID(N'v_Cartera_Cliente', N'V') IS NOT NULL
DROP VIEW v_Cartera_Cliente
GO
CREATE VIEW v_Cartera_Cliente AS (
	SELECT 
		 idDocumento = cc.idCuentaPorCobrar
		,cc.idEntidad
		,pe.codEstab
		,cc.idCliente
		,cc.idEstadoPago
		,codigo = cc.codDoc
		,cc.fechaEmision
		,cc.fechaVencimiento
		,nroDoc = cc.serieComprobante
		,total  = cc.importeTotal
		,cc.abono
		,cc.saldo
		,cc.estado
		,expira = (
		           SELECT DATEDIFF(DAY,MIN(cx.fechaVencimiento),dbo.ufnGetDateEcuador()) 
		           FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK) WHERE cx.idCuentaPorCobrar = cc.idCuentaPorCobrar
				  )
	FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) 
	INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision  = cc.idPuntoEmision
	WHERE cc.estado = 1
 )