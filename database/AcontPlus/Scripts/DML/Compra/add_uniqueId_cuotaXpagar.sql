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

--FACTURAS FISICAS
--INSERT INTO Contabilidad.CuotaPorPagar(idCuentaPorPagar,idEstadoPago,nroCuota,fechaVencimiento,cuota,abono,entrada,estado)
--SELECT c.idCuentaPorPagar,x.idEstadoPago,x.nroCuota,x.fechaVencimiento,x.cuota,x.abono,x.entrada,x.estado
--FROM CuotaXPagar x
--INNER JOIN Contabilidad.CuentaPorPagar c ON c.uniqueId = x.uniqueId

--select * from Contabilidad.CuentaPorPagar
