USE [AcontPlus]
GO

--ALTER TABLE dbo.RetencionVenta ALTER COLUMN idSucursal INT NULL

--ALTER TABLE dbo.RetencionVenta ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--UPDATE rv set 
--	rv.codEstab = s.codEstab
--FROM dbo.RetencionVenta rv
--INNER JOIN dbo.Sucursal s ON s.idSucursal = rv.idSucursal

--ALTER TABLE dbo.RetencionVenta ALTER COLUMN codEstab VARCHAR(50) NOT NULL
--ALTER TABLE dbo.RetencionVenta DROP COLUMN idSucursal 

SELECT * FROM RetencionVenta 