USE [AcontPlus]
go

--ALTER TABLE ComprobanteEgreso ALTER COLUMN idSucursal INT NULL
--ALTER TABLE ComprobanteEgreso ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--update ce SET	
--	ce.codEstab = s.codEstab
--FROM ComprobanteEgreso ce
--INNER JOIN dbo.Sucursal s ON s.idSucursal = ce.idSucursal

--ALTER TABLE ComprobanteIngreso ALTER COLUMN codEstab VARCHAR(50) NOT NULL

--DECLARE @table TABLE 
--(	
--	idComprobanteEgreso VARCHAR(50)
--   ,secuencial INT
--)
--INSERT INTO @table (idComprobanteEgreso,secuencial)
--select idComprobanteEgreso ,secuencial = ROW_NUMBER() OVER (PARTITION  BY idSucursal ORDER BY idSucursal ASC) from ComprobanteEgreso order by idSucursal ASC


--UPDATE ce SET	
--	ce.nroDocumento = t.secuencial
--FROM ComprobanteEgreso ce
--INNER JOIN @table t ON t.idComprobanteEgreso = ce.idComprobanteEgreso

--select * from @table

select * from ComprobanteEgreso where codEstab = 'ESTAB-000000003' ORDER BY nroDocumento ASC