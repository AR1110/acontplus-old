USE [AcontPlus]
GO 

--ALTER TABLE dbo.FacturaCompra DROP CONSTRAINT [FK__FacturaCo__idSuc__490FC9A0]
--ALTER TABLE dbo.FacturaCompra ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--UPDATE fc SET
--	fc.codEstab = s.codEstab
--FROM dbo.FacturaCompra fc 
--INNER JOIN dbo.Sucursal s ON s.idSucursal = fc.idSucursal

--ALTER TABLE dbo.FacturaCompra DROP COLUMN idSucursal 
--ALTER TABLE dbo.FacturaCompra ALTER COLUMN codEstab VARCHAR(50) NOT NULL

SELECT * FROM dbo.FacturaCompra
