USE [Acontplus]
go 

--ALTER TABLE dbo.NotaCredito ADD idDocumentoElectronico BIGINT CONSTRAINT FK_NotaCredito_DocElectr REFERENCES dbo.DocumentoElectronico(idDocumentoElectronico)

--UPDATE nc set
--       nc.idDocumentoElectronico  = (select top 1 de.idDocumentoElectronico from DocumentoElectronico de where de.idDocumento = nc.idNotaCredito and codDoc = '04')
--from dbo.NotaCredito nc 


--select * from NotaCredito where idDocumentoElectronico is null

 --> Facturacion Electronica
--INSERT INTO dbo.DocumentoElectronico WITH (ROWLOCK)
--        (codDoc,idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,idDocumento,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEntidad,idEstadoServicio,serieComprobante)

--select '04',idTipoDocumento,nc.idPuntoEmision,fechaEmision,'1.1.0',idNotaCredito,cl.CustomerId,nc.nroDocumento,claveAcceso,1,nc.idUsuario,nc.idEntidad,8
--      ,es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(nc.nroDocumento AS VARCHAR(9)),9)
--from NotaCredito nc
--inner join Cliente cl on cl.idCliente = nc.idCliente
--inner join PuntoEmision pe on pe.idPuntoEmision = nc.idPuntoEmision
--inner join sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento
--where idDocumentoElectronico is null

--ALTER TABLE dbo.NotaCredito ALTER COLUMN idDocumentoElectronico BIGINT NOT NULL

--ALTER TABLE dbo.NotaCredito DROP CONSTRAINT FK__NotaCredi__idTip__55959C16

--ALTER TABLE dbo.NotaCredito DROP COLUMN idTipoDocumento

--ALTER TABLE dbo.NotaCredito DROP CONSTRAINT FK__NotaCredi__idPun__577DE488

--ALTER TABLE dbo.NotaCredito DROP COLUMN idPuntoEmision

--ALTER TABLE dbo.NotaCredito DROP COLUMN nroDocumento

--ALTER TABLE dbo.NotaCredito DROP COLUMN fechaEmision

--ALTER TABLE dbo.NotaCredito DROP CONSTRAINT DF__NotaCredi__autor__59662CFA

--ALTER TABLE dbo.NotaCredito DROP COLUMN autorizada

--ALTER TABLE dbo.NotaCredito DROP CONSTRAINT DF__NotaCredi__anula__5A5A5133

--ALTER TABLE dbo.NotaCredito DROP COLUMN anulada

--ALTER TABLE dbo.NotaCredito DROP COLUMN nroAutorizacion

--ALTER TABLE dbo.NotaCredito DROP COLUMN claveAcceso

--ALTER TABLE dbo.NotaCredito DROP COLUMN fechaAutorizacion

--ALTER TABLE dbo.NotaCredito DROP COLUMN saldo

--ALTER TABLE dbo.NotaCredito DROP CONSTRAINT DF__NotaCredi__abono__5F740C0B

--ALTER TABLE dbo.NotaCredito DROP COLUMN abono

--ALTER TABLE dbo.NotaCredito DROP COLUMN ambiente

--ALTER TABLE dbo.NotaCredito DROP CONSTRAINT fk_NotaCredito_Entidad

--ALTER TABLE dbo.NotaCredito DROP COLUMN idEntidad

select  *  from NotaCredito
