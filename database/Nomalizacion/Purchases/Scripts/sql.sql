use [Acontplus]
go 

--CREATE SCHEMA [Purchases]



--SELECT top 100 dr.idDocumento       as Id
--              ,dr.idEstablecimiento as EstablishmentId
--FROM Recepcion.DocumentoRecibido dr
--INNER JOIN Sri.Establecimiento   es ON es.idEstablecimiento = dr.idEstablecimiento

--> Eliminar las Colunmas comprobante y codDoc por idTipoDocumento, Primera Forma Normal (1FN) 

--ALTER TABLE Recepcion.DocumentoRecibido ADD idTipoDocumento BIGINT CONSTRAINT FK_DocumentoRecibido_TipoDocumento_idTipoDocumento FOREIGN KEY(idTipoDocumento) REFERENCES dbo.TipoDocumento(idTipoDocumento)

SELECT TOP 10 * FROM Recepcion.DocumentoRecibido dr
