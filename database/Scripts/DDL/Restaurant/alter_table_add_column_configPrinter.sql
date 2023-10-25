use [AcontPlus]
GO

--ALTER TABLE Restaurant.ConfigPrinter ALTER COLUMN idSucursal INT

--ALTER TABLE Restaurant.ConfigPrinter ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--UPDATE c SET 
--	c.codEstab = s.codEstab
--FROM Restaurant.ConfigPrinter c
--INNER JOIN dbo.Sucursal s ON s.idSucursal = c.idSucursal

--ALTER TABLE Restaurant.ConfigPrinter ALTER COLUMN codEstab VARCHAR(50) NOT NULL

SELECT * FROM Restaurant.ConfigPrinter