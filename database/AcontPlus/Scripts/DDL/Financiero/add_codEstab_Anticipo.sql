use [AcontPlus]
go 

--ALTER TABLE dbo.Anticipo ALTER COLUMN idSucursal INT NULL
----ALTER TABLE dbo.Anticipo ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--UPDATE a SET	
--	a.codEstab = s.codEstab
--FROM dbo.Anticipo a 
--INNER JOIN dbo.Sucursal s ON s.idSucursal = a.idSucursal


--ALTER TABLE dbo.Anticipo ALTER COLUMN codEstab VARCHAR(50) NOT NULL

DECLARE @table TABLE 
(	
	idAnticipo VARCHAR(50)
   ,secuencial INT
)
INSERT INTO @table (idAnticipo,secuencial)
select idAnticipo ,secuencial = ROW_NUMBER() OVER (PARTITION  BY idSucursal,idTipoDocumento ORDER BY idSucursal ASC) from Anticipo  ORDER BY idSucursal ASC


--UPDATE a SET	
--	a.nroDoc = t.secuencial
--FROM Anticipo a 
--INNER JOIN @table t ON t.idAnticipo = a.idAnticipo


SELECT * FROM dbo.Anticipo