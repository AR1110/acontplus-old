use [Acontplus]
go 


--ALTER TABLE dbo.GuiaRemision ADD idDocumentoElectronico BIGINT CONSTRAINT FK_GuiaRemision_factELect FOREIGN KEY (idDocumentoElectronico) REFERENCES dbo.DocumentoElectronico(idDocumentoElectronico)

--select top 5 * from DocumentoElectronico where idTipoDocumento = 9

--> Facturacion Electronica
--INSERT INTO dbo.DocumentoElectronico WITH (ROWLOCK)
--        (codDoc,idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,idDocumento,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEntidad,idEstadoServicio,serieComprobante)
--select '06',gr.idTipoDocumento,gr.idPuntoEmision,gr.fechaEmision,'1.1.0',gr.idGuiaRemision,cl.CustomerId,gr.nroDocumento,gr.claveAcceso,0,gr.idUsuario,gr.idEntidad,8,es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(gr.nroDocumento AS VARCHAR(9)),9)
--from GuiaRemision gr 
--inner join Cliente cl on cl.idCliente = gr.idCliente
--inner join PuntoEmision pe on pe.idPuntoEmision = gr.idPuntoEmision
--inner join sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento
--where idDocumentoElectronico is null

--update GuiaRemision set idUsuario = 209 where idDocumentoElectronico is null

--UPDATE gr set
--    gr.idDocumentoElectronico = (select top 1 idDocumentoElectronico from dbo.DocumentoElectronico de where de.codDoc = '06' and de.idDocumento = gr.idGuiaRemision )
--FROM GuiaRemision gr

--ALTER TABLE dbo.GuiaRemision ALTER COLUMN idDocumentoElectronico BIGINT NOT NULL

--ALTER TABLE dbo.GuiaRemision DROP CONSTRAINT FK__GuiaRemis__idTip__418EA369

--ALTER TABLE dbo.GuiaRemision DROP COLUMN idTipoDocumento 

--ALTER TABLE dbo.GuiaRemision DROP CONSTRAINT FK__GuiaRemis__idPun__230A1C49

--ALTER TABLE dbo.GuiaRemision DROP COLUMN idPuntoEmision 

--ALTER TABLE dbo.GuiaRemision DROP COLUMN fechaEmision

--ALTER TABLE dbo.GuiaRemision DROP COLUMN nroAutorizacion

--ALTER TABLE dbo.GuiaRemision DROP COLUMN claveAcceso

--ALTER TABLE dbo.GuiaRemision DROP COLUMN fechaAutorizacion

--ALTER TABLE dbo.GuiaRemision DROP CONSTRAINT DF__GuiaRemis__autor__27CED166

--ALTER TABLE dbo.GuiaRemision DROP COLUMN autorizada

--ALTER TABLE dbo.GuiaRemision DROP CONSTRAINT DF__GuiaRemis__anula__28C2F59F

--ALTER TABLE dbo.GuiaRemision DROP COLUMN anulada

--ALTER TABLE dbo.GuiaRemision DROP COLUMN nroDocumento

--ALTER TABLE dbo.GuiaRemision DROP COLUMN idEntidad

SELECT * FROM GuiaRemision