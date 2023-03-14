use [AcontPlus]

--alter table dbo.CuotaXPagar ADD uniqueId VARCHAR(20)

declare @table as table(
	 idCuotaXPagar INT NOT NULL
	,uniqueId VARCHAR(20) NOT NULL
)

INSERT INTO @table (idCuotaXPagar,uniqueId)
SELECT cxp.idCuotaXPagar
	  ,fc.uniqueId
FROM CuotaXPagar cxp 
INNER JOIN dbo.TipoDocumento td ON td.idTipoDocumento = cxp.idTipoDocumento
INNER JOIN dbo.FacturaCompra fc ON fc.idFacturaCompra = cxp.idComprobante AND cxp.idTipoDocumento = fc.idTipoDocumento
where td.codigo = 'FC'

--UPDATE cxp set
--	cxp.uniqueId = t.uniqueId
--FROM CuotaXPagar cxp 
--INNER JOIN @table t ON t.idCuotaXPagar = cxp.idCuotaXPagar

--SELECT * FROM @table

select * from CuotaXPagar

--select * from Contabilidad.CuentaPorPagar
