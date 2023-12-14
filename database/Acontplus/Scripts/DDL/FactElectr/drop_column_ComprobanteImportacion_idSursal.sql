use [AcontPlus]
go

--ALTER TABLE FactElect.ComprobanteImportacion ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)

--UPDATE ci	SET
--	ci.codEstab = s.codEstab
--FROM FactElect.ComprobanteImportacion ci
--INNER JOIN dbo.Sucursal s ON s.idSucursal = ci.idSucursal

--ALTER TABLE FactElect.ComprobanteImportacion DROP COLUMN idSucursal
--ALTER TABLE FactElect.ComprobanteImportacion ALTER COLUMN codEstab VARCHAR(50) NOT NULL
select * from FactElect.ComprobanteImportacion