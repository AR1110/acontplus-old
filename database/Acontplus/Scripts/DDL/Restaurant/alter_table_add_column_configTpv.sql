USE [AcontPlus]
GO

--ALTER TABLE Restaurant.ConfigTpv ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--ALTER TABLE Restaurant.ConfigTpv ALTER COLUMN idSucursal INT NULL

--UPDATE ctpv SET
--	ctpv.codEstab = s.codEstab
--FROM Restaurant.ConfigTpv ctpv 
--INNER JOIN dbo.Sucursal s ON s.idSucursal = ctpv.idSucursal

--ALTER TABLE Restaurant.ConfigTpv ALTER COLUMN codEstab VARCHAR(50) NOT NULL

SELECT * FROM Restaurant.ConfigTpv