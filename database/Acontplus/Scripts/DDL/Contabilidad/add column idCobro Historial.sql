use [Acontplus]
go 

--ALTER TABLE Contabilidad.Historial_Cobro ADD secuencial INT

--ALTER TABLE Contabilidad.Historial_Cobro ADD idCobro BIGINT 

--ALTER TABLE Contabilidad.Historial_Cobro ADD CONSTRAINT FK_Cobro FOREIGN KEY (idCobro) REFERENCES dbo.Cobro(idCobro)

SELECT * FROM Contabilidad.Historial_Cobro

--INSERT INTO Contabilidad.Historial_Cobro 
--      (
--		idCuentaPorCobrar
--	   ,idCobro
--	   ,idComprobanteIngreso
--	   ,abono
--	   ,saldo
--	  )
--SELECT cc.idCuentaPorCobrar
--      ,co.idCobro
--	  ,co.idComprobanteIngreso
--	  ,sum(cd.abono) as abono
--	  ,cc.importeTotal
--FROM dbo.CobroDetalle                   cd WITH (NOLOCK)
--INNER JOIN Contabilidad.CuotaPorCobrar  cu WITH (NOLOCK) ON cu.idCuotaPorCobrar     = cd.idCuotaPorCobrar
--INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = cu.idCuentaPorCobrar
--INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro              = cd.idCobro
--INNER JOIN dbo.ComprobanteIngreso       ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
--INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
--GROUP BY cc.idCuentaPorCobrar
--      ,co.idCobro
--	  ,co.idComprobanteIngreso
--	  ,cc.importeTotal
--ORDER BY idCuentaPorCobrar,abono ASC

--ALTER TABLE Contabilidad.Historial_Cobro ALTER COLUMN idCobro BIGINT NOT NULL



