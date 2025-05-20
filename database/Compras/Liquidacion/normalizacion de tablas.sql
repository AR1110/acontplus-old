use [Acontplus]
go

--ALTER TABLE dbo.LiquidacionCompra ADD idDocumentoElectronico BIGINT CONSTRAINT FK_Liquidacion_DocElect REFERENCES dbo.DocumentoElectronico(idDocumentoElectronico)


--select * from TipoDocumento where idTipoDocumento = 5

--UPDATE lc SET
--       lc.idDocumentoElectronico = (select top 1 idDocumentoElectronico from dbo.DocumentoElectronico where codDoc = '03' and idDocumento = lc.idLiquidacionCompra)
--FROM LiquidacionCompra lc

 --> Facturacion Electronica
--INSERT INTO dbo.DocumentoElectronico WITH (ROWLOCK)
--        (codDoc,idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,idDocumento,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEntidad,idEstadoServicio,serieComprobante)
			
--select '03',lc.idTipoDocumento,lc.idPuntoEmision,lc.fechaEmision,'1.1.0',lc.idLiquidacionCompra,pr.CustomerId,nroDocumento,claveAcceso,0,lc.idUsuario,lc.idEntidad,8
--      ,es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(lc.nroDocumento AS VARCHAR(9)),9)
--from LiquidacionCompra lc
--INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = lc.idPuntoEmision
--inner join Sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento
--inner join dbo.Entidad         en on en.idEntidad         = es.idEntidad
--inner join dbo.proveedor       pr on pr.idProveedor        = lc.idProveedor
--where idDocumentoElectronico  is null


--ALTER TABLE dbo.LiquidacionCompra ALTER COLUMN idDocumentoElectronico BIGINT NOT NULL


--ALTER TABLE dbo.LiquidacionCompra DROP CONSTRAINT FK__Liquidaci__idTip__2698B79A

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN idTipoDocumento

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN nroDocumento

--ALTER TABLE dbo.LiquidacionCompra DROP CONSTRAINT FK__Liquidaci__idPun__1EE485AA

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN idPuntoEmision

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN fechaEmision

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN nroAutorizacion

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN claveAcceso

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN fechaAutorizacion

--ALTER TABLE dbo.LiquidacionCompra DROP CONSTRAINT DF__Liquidaci__autor__21C0F255

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN autorizada

--ALTER TABLE dbo.LiquidacionCompra DROP CONSTRAINT DF__Liquidaci__anula__22B5168E

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN anulada

--ALTER TABLE dbo.LiquidacionCompra DROP CONSTRAINT FK__Liquidaci__idEnt__646DCB52

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN idEntidad

--ALTER TABLE dbo.LiquidacionCompra DROP COLUMN fechaBaja

select top 5 * from dbo.LiquidacionCompra 
