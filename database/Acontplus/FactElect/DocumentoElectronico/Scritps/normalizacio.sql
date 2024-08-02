use [Acontplus]
go 

--ALTER TABLE documentoElectronico ADD idTipoDocumento BIGINT CONSTRAINT FK_TipoDoc_DocElect REFERENCES dbo.TipoDocumento(idTipoDocumento)
--
--select top 10 * from documentoElectronico

--UPDATE de set
--    de.idTipoDocumento = (select top 1 idTipoDocumento from tipoDocumento td where td.codigoSri = de.codDoc )
--FROM dbo.DocumentoElectronico de
--ALTER TABLE documentoElectronico ALTER COLUMN idTipoDocumento BIGINT NOT NULL

--> ALTER TABLE DocumentoElectronico ALTER COLUMN idTipoDocumento BIGINT NOT NULL

--ALTER TABLE DocumentoElectronico ADD serieComprobante VARCHAR(50)

select top 10 * from documentoElectronico

--UPDATE de set
--    de.serieComprobante = es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(de.nroDocumento AS VARCHAR(9)),9)
--FROM DocumentoElectronico de WITH (ROWLOCK)
--INNER JOIN dbo.PuntoEmision pe with (rowlock) on pe.idPuntoEmision = de.idPuntoEmision
--inner join Sri.Establecimiento es with (rowlock) on es.idEstablecimiento= pe.idEstablecimiento

--ALTER TABLE DocumentoElectronico ALTER COLUMN serieComprobante VARCHAR(50) NOT NULL

--ALTER TABLE dbo.DocumentoElectronico DROP COLUMN codDoc

--ALTER TABLE dbo.DocumentoElectronico DROP COLUMN idDocumento
--ALTER TABLE dbo.DocumentoElectronico DROP CONSTRAINT fk_de_entidad

--ALTER TABLE dbo.DocumentoElectronico DROP COLUMN idEntidad