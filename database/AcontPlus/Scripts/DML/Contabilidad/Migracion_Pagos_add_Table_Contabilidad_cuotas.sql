use [Acontplus]
go 

--ALTER TABLE pagodetalle add idCuotaPorPagar INT FOREIGN KEY REFERENCES contabilidad.cuotaporpagar(idCuotaPorPagar)
--ALTER TABLE pagodetalle ALTER COLUMN idCuotaPorPagar INT NOT NULL


--update pd SET
--	pd.idCuotaPorPagar = cp.idCuotaPorPagar
--FROM pagoDetalle pd
--INNER JOIN contabilidad.cuotaporpagar cp ON cp.idCuotaXPagar = pd.idCuotaXPagar

--ALTER TABLE pagodetalle  DROP CONSTRAINT [FK__PagoDetal__idCuo__1486F2C8]

--ALTER TABLE pagodetalle DROP COLUMN [idCuotaXPagar]}

select * from pagodetalle