USE [Acontplus]
go 

SELECT * FROM Contabilidad.CuentaPorCobrar where idCuentaPorCobrar = 135953


select * from Contabilidad.CuotaPorCobrar where idCuentaPorCobrar = 135953


--UPDATE Contabilidad.CuentaPorCobrar set mora = 0 ,abono =  1.01 where idCuentaPorCobrar = 135953
--UPDATE Contabilidad.CuotaPorCobrar set mora = 0 ,abono =  1.01 where idCuentaPorCobrar = 135953

--ALTER TABLE Contabilidad.CuentaPorCobrar DROP COLUMN saldo

--ALTER TABLE Contabilidad.CuentaPorCobrar ADD saldo AS ((importeTotal + mora) - abono) PERSISTED;


--ALTER TABLE Contabilidad.CuotaPorCobrar DROP COLUMN saldo

--ALTER TABLE Contabilidad.CuotaPorCobrar ADD saldo AS ((cuota + mora) - abono) PERSISTED;