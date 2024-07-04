use [Acontplus]
go 


--ALTER TABLE FactElect.RetencionAts ADD idDocumentoElectronico BIGINT CONSTRAINT FK_Retencion_DocElect REFERENCES dbo.DocumentoElectronico(idDocumentoElectronico)

--ALTER TABLE FactElect.RetencionAts ADD CONSTRAINT FK_Retencion_Proveedor FOREIGN KEY(idProveedor) REFERENCES dbo.Proveedor(idProveedor)

--select COUNT(*) from DocumentoElectronico WHERE idTipoDocumento = 8 and versionComp = '2.0.0'

--update rt SET
--    rt.idDocumentoElectronico = (select top 1 de.idDocumentoElectronico from DocumentoElectronico de where de.codDoc = '07' and de.versionComp = '2.0.0' and de.idDocumento = rt.idRetencionAts)
--FROM FactElect.RetencionAts  rt

--INSERT INTO dbo.DocumentoElectronico WITH (ROWLOCK)
--        (codDoc,idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,idDocumento,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEntidad,idEstadoServicio,serieComprobante)

--select '07',8 as idTipoDocumento
--      ,(select top 1 pe.idPuntoEmision
--       from dbo.PuntoEmision pe 
--       where pe.idEstablecimiento = es.idEstablecimiento) as idPuntoEmision
--       ,fechaEmision
--       ,'2.0.0' as versionComp
--       ,ra.idRetencionAts
--       ,pr.CustomerId
--       ,ra.secuencial
--       ,ra.claveAcceso
--       ,0
--       ,ra.idUsuario
--       ,es.idEntidad
--       ,8
--       ,ra.estab + '-' + ra.ptoEmi + '-' + RIGHT('000000000' + CAST(ra.secuencial AS VARCHAR(9)),9)
--from FactElect.RetencionAts ra 
--inner join dbo.Proveedor pr on pr.idProveedor = ra.idProveedor
--inner join Sri.Establecimiento es on es.codEstab = ra.codEstab
--where idDocumentoElectronico is null

--ALTER TABLE FactElect.RetencionAts ALTER COLUMN idDocumentoElectronico BIGINT NOT NULL

--select *  from dbo.TipoDocumento WHERE codigoSri = '07'

--ALTER TABLE FactElect.RetencionAts DROP COLUMN ambiente

--ALTER TABLE FactElect.RetencionAts DROP COLUMN idSucursal

--ALTER TABLE FactElect.RetencionAts DROP COLUMN claveAcceso

--ALTER TABLE FactElect.RetencionAts DROP COLUMN estab

--ALTER TABLE FactElect.RetencionAts DROP COLUMN ptoEmi

--ALTER TABLE FactElect.RetencionAts DROP COLUMN secuencial

--ALTER TABLE FactElect.RetencionAts DROP CONSTRAINT DF__Retencion__codDo__3C0E3363

--ALTER TABLE FactElect.RetencionAts DROP COLUMN codDoc

--ALTER TABLE FactElect.RetencionAts DROP COLUMN fechaEmision

--ALTER TABLE FactElect.RetencionAts DROP COLUMN contribuyentEspecial

--ALTER TABLE FactElect.RetencionAts DROP COLUMN obligadoContabilidad

--ALTER TABLE FactElect.RetencionAts DROP COLUMN tipoIdentificacionSujetoRetenido

--ALTER TABLE FactElect.RetencionAts DROP COLUMN razonSocialSujetoRetenido

--ALTER TABLE FactElect.RetencionAts DROP COLUMN identificacionSujetoRetenido

--ALTER TABLE FactElect.RetencionAts DROP COLUMN codEstab 

SELECT * FROM FactElect.RetencionAts

