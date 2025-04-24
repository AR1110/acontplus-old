use acontplus
GO

CREATE OR ALTER VIEW v_Cartera_Cliente AS (
	SELECT 
		 idDocumento = cc.idCuentaPorCobrar
		,cc.idEntidad
		,es.codEstab
		,cc.idCliente
		,cc.idEstadoPago
		,codigo = cc.codDoc
		,cc.fechaEmision
		,cc.fechaVencimiento
		,nroDoc = cc.serieComprobante
		,total  = cc.importeTotal
		,cc.mora
        ,cc.diasMora
        ,cc.abono
		,cc.saldo
		,cc.estado
		,expira = (
		           SELECT DATEDIFF(DAY,MIN(cx.fechaVencimiento),dbo.ufnGetDateEcuador()) 
		           FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK) WHERE cx.idCuentaPorCobrar = cc.idCuentaPorCobrar
				  )
	FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) 
	INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision    = cc.idPuntoEmision
    INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento 
	--WHERE cc.estado = 1
 )