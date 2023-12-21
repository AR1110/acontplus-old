
USE [AcontPlus]
GO 

--ALTER TABLE ApiPrinter.Impresora ALTER COLUMN idSucursal INT NULL

--ALTER TABLE ApiPrinter.Impresora ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--update printer SET	
--	printer.codEstab = s.codEstab
--FROM ApiPrinter.Impresora printer
--INNER JOIN dbo.Sucursal s ON s.idSucursal = printer.idSucursal

select * from ApiPrinter.Impresora

--ALTER TABLE ApiPrinter.Impresora ALTER COLUMN codEstab VARCHAR(50) NOT NULL