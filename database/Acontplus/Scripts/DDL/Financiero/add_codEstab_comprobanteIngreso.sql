USE [AcontPlus]
GO
--ALTER TABLE ComprobanteIngreso ALTER COLUMN idSucursal INT NULL
--ALTER TABLE ComprobanteIngreso ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--update ci SET	
--	ci.codEstab = s.codEstab
--FROM ComprobanteIngreso ci 
--INNER JOIN dbo.Sucursal s ON s.idSucursal = ci.idSucursal

--ALTER TABLE ComprobanteIngreso ALTER COLUMN codEstab VARCHAR(50) NOT NULL

DECLARE @table TABLE 
(	
	idComprobanteIngreso VARCHAR(50)
   ,secuencial INT
)
INSERT INTO @table (idComprobanteIngreso,secuencial)
select idComprobanteIngreso ,secuencial = ROW_NUMBER() OVER (PARTITION  BY idSucursal ORDER BY idSucursal ASC) from ComprobanteIngreso order by idSucursal ASC


--UPDATE ci SET	
--	ci.nroDocumento = t.secuencial
--FROM ComprobanteIngreso ci 
--INNER JOIN @table t ON t.idComprobanteIngreso = ci.idComprobanteIngreso

--select * from @table

select * from ComprobanteIngreso where codEstab = 'ESTAB-000000003' ORDER BY nroDocumento ASC