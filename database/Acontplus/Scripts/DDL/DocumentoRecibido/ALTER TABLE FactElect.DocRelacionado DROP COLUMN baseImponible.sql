USE [Acontplus]
GO 


--ALTER TABLE FactElect.DocRelacionado DROP COLUMN baseImponible 
--ALTER TABLE FactElect.DocRelacionado DROP COLUMN porcentajeRetener 
--ALTER TABLE FactElect.DocRelacionado DROP COLUMN valorRetenido 

SELECT idDocumento,codDoc,versionComp FROM Recepcion.DocumentoRecibido WHERE codDoc = '07' and xmlCompressed is not null



select * from FactElect.DocRelacionado where idDocumentoRecibido in (10127,10128) order by idDocumentoRecibido asc
--SELECT [Discount], [Code], [CodePercentage], [Fee], [TaxBase], [TaxValue] FROM Recepcion.DocumentoImpuesto

--10127
--10128