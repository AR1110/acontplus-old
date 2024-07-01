use [Acontplus]
go

--ALTER TABLE dbo.LiquidacionCompra ADD idDocumentoElectronico BIGINT CONSTRAINT FK_Liquidacion_DocElect REFERENCES dbo.DocumentoElectronico(idDocumentoElectronico)


--select * from TipoDocumento where idTipoDocumento = 5

--UPDATE lc SET
--       lc.idDocumentoElectronico = (select top 1 idDocumentoElectronico from dbo.DocumentoElectronico where codDoc = '03' and idDocumento = lc.idLiquidacionCompra)
--FROM LiquidacionCompra lc


--ALTER TABLE dbo.LiquidacionCompra ALTER COLUMN idDocumentoElectronico BIGINT NOT NULL

select * from dbo.LiquidacionCompra 

--select * from DocumentoElectronico where codDoc = '03'