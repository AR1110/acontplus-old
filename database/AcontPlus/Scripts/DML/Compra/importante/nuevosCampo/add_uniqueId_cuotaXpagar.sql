use [AcontPlus]

--alter table dbo.CuotaXPagar ADD uniqueId VARCHAR(20)

--SELECT * FROM @table

INSERT INTO Contabilidad.CuotaPorPagar(idCuentaPorPagar,idEstadoPago,nroCuota,fechaVencimiento,cuota,abono,entrada,estado,idCuotaXPagar)
SELECT c.idCuentaPorPagar,x.idEstadoPago,x.nroCuota,x.fechaVencimiento,x.cuota,x.abono,x.entrada,x.estado,X.idCuotaXPagar
FROM CuotaXPagar x
INNER JOIN Contabilidad.CuentaPorPagar c ON c.uniqueId = x.uniqueId

select * from Contabilidad.CuotaPorPagar
