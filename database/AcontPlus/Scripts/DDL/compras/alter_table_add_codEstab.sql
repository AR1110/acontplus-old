USE [AcontPlus]
GO

--ALTER TABLE dbo.NotaCreditoProveedor ALTER COLUMN idSucursal INT  NULL
--ALTER TABLE dbo.NotaCreditoProveedor ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)


--UPDATE vc SET
--	vc.codEstab = s.codEstab
--FROM dbo.NotaCreditoProveedor vc 
--INNER JOIN dbo.Sucursal s ON s.idSucursal = vc.idSucursal


--ALTER TABLE dbo.NotaCreditoProveedor ALTER COLUMN codEstab VARCHAR(50) NOT  NULL 
SELECT * FROM NotaCreditoProveedor