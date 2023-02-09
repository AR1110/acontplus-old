USE [AcontPlus]
GO

--ALTER TABLE FactElect.CompraHabitual DROP CONSTRAINT [fk_CH_Sucursal]
--ALTER TABLE FactElect.CompraHabitual ALTER COLUMN idSucursal INT NULL

--ALTER TABLE FactElect.CompraHabitual ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--UPDATE c SET
--	 c.codEstab = s.codEstab
--FROM FactElect.CompraHabitual c
--INNER JOIN dbo.Sucursal s ON s.idSucursal = c.idSucursal

--ALTER TABLE FactElect.CompraHabitual DROP COLUMN idSucursal 
--ALTER TABLE FactElect.CompraHabitual ALTER COLUMN codEstab VARCHAR(50) NOT NULL

select * from FactElect.CompraHabitual