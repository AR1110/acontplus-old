use [Acontplus]
go 

--ALTER TABLE dbo.factura ADD idDocumentoElectronico BIGINT CONSTRAINT FK_docElectr_Fac REFERENCES dbo.DocumentoElectronico (idDocumentoElectronico)

--SELECT COUNT(*) from dbo.factura

--select count(*) from documentoElectronico where codDoc = '01'

--UPDATE f set
--	f.idDocumentoElectronico  = (select top 1 idDocumentoElectronico from documentoElectronico where codDoc = '01' and idDocumento = f.idFactura)
--from factura f
--where idDocumentoElectronico  is null


--ALTER TABLE dbo.factura ALTER COLUMN idDocumentoElectronico BIGINT  NOT NULL

 --> Facturacion Electronica
--INSERT INTO dbo.DocumentoElectronico WITH (ROWLOCK)
--        (codDoc,idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,idDocumento,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEntidad,idEstadoServicio,serieComprobante)
			
--select '01',f.idTipoDocumento,f.idPuntoEmision,f.fechaEmision,'1.1.0',idFactura,cl.CustomerId,nroFactura,claveAcceso,0,f.idUsuario,f.idEntidad,8
--      ,es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(f.nroFactura AS VARCHAR(9)),9)
--from factura f
--INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = f.idPuntoEmision
--inner join Sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento
--inner join dbo.Entidad         en on en.idEntidad         = es.idEntidad
--inner join dbo.Cliente         cl on cl.idCliente        = f.idCliente
--where idDocumentoElectronico  is null


--update f  set
--    f.claveAcceso = dbo.ufnGeneraClaveAcceso( dbo.AFTDeleteCero(es.estab)
--      ,'01'
--      ,pe.ambiente
--      ,'1'
--      ,dbo.AFTConvertDate(f.fechaEmision)
--      ,en.ruc
--      ,es.estab + pe.ptoEmi
--      ,Helper.F_Auto_Sequential(f.nroFactura))
--from factura f
--INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = f.idPuntoEmision
--inner join Sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento
--inner join dbo.Entidad         en on en.idEntidad         = es.idEntidad
--where idDocumentoElectronico  is null
--and claveAcceso is null

--> Normlaizacion Sri 
--ALTER TABLE dbo.Factura DROP COLUMN nroAutorizacion

--ALTER TABLE dbo.Factura DROP COLUMN claveAcceso

--ALTER TABLE dbo.Factura DROP COLUMN fechaAutorizacion

--ALTER TABLE dbo.Factura DROP COLUMN ambiente

--ALTER TABLE dbo.Factura DROP CONSTRAINT DF__Factura__autoriz__4B2D1C3C

--ALTER TABLE dbo.Factura DROP COLUMN autorizada

--ALTER TABLE dbo.Factura DROP CONSTRAINT DF__Factura__anulada__4C214075

--ALTER TABLE dbo.Factura DROP COLUMN anuladaSri

--ALTER TABLE dbo.Factura DROP CONSTRAINT FK__Factura__idTipoD__4668671F

--ALTER TABLE dbo.Factura DROP COLUMN idTipoDocumento

--ALTER TABLE dbo.Factura DROP CONSTRAINT FK__Factura__idPunto__457442E6

--ALTER TABLE dbo.Factura DROP COLUMN idPuntoEmision

--ALTER TABLE dbo.Factura DROP COLUMN nroFactura

--ALTER TABLE dbo.Factura DROP COLUMN fechaEmision

--ALTER TABLE dbo.Factura DROP CONSTRAINT FK__Factura__idEntid__552B87C2

--ALTER TABLE dbo.Factura DROP CONSTRAINT FK__Factura__idEntid__683E5C36

--ALTER TABLE dbo.Factura DROP COLUMN idEntidad

select top 5 * from factura