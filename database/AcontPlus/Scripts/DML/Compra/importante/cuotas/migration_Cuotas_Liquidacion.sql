use [AcontPlus]

--alter table dbo.CuotaXPagar ADD uniqueId VARCHAR(20)

declare @table as table(
	 idCuotaXPagar INT NOT NULL
	,uniqueId VARCHAR(20) NOT NULL
)

INSERT INTO @table (idCuotaXPagar,uniqueId)
SELECT cxp.idCuotaXPagar
	  ,lc.uniqueId
FROM CuotaXPagar cxp 
INNER JOIN dbo.TipoDocumento td ON td.idTipoDocumento = cxp.idTipoDocumento
INNER JOIN dbo.LiquidacionCompra lc ON lc.idLiquidacionCompra = cxp.idComprobante AND cxp.idTipoDocumento = lc.idTipoDocumento
where td.codigo = 'LC'

UPDATE cxp set
	cxp.uniqueId = t.uniqueId
FROM CuotaXPagar cxp 
INNER JOIN @table t ON t.idCuotaXPagar = cxp.idCuotaXPagar


--select * from Contabilidad.CuentaPorPagar
