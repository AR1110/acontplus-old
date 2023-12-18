use [Acontplus]
go 

--DELETE FROM Ventas.NotaEntregaImpuesto

--ALTER TABLE Ventas.NotaEntregaImpuesto ADD NotaEntregaId BIGINT NOT NULL

--ALTER TABLE Ventas.NotaEntregaImpuesto ADD Discount NUMERIC(15,5) NOT NULL

--ALTER TABLE Ventas.NotaEntregaImpuesto DROP COLUMN Uuid 


--ALTER TABLE Ventas.NotaEntregaImpuesto DROP CONSTRAINT [fk_NotaEntregaImpuesto_NotaEntregaDetalle]

--ALTER TABLE Ventas.NotaEntregaImpuesto DROP CONSTRAINT [fk_NotaEntregaImpuesto_SriImpuesto]

--ALTER TABLE Ventas.NotaEntregaImpuesto DROP CONSTRAINT [fk_NotaEntregaImpuesto_SriPorcentajeImpuesto]

--ALTER TABLE Ventas.NotaEntregaImpuesto DROP COLUMN [NotaEntregaDetalleId]

--ALTER TABLE Ventas.NotaEntregaImpuesto ADD CONSTRAINT fk_NotaEntrega FOREIGN KEY (NotaEntregaId) REFERENCES dbo.NotaEntrega(idNotaEntrega)

--ALTER TABLE Ventas.NotaEntregaImpuesto ADD CONSTRAINT fk_NotaEntregaImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES dbo.Impuesto(idImpuesto)

--ALTER TABLE Ventas.NotaEntregaImpuesto ADD CONSTRAINT fk_NotaEntregaImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES dbo.TipoIva(idTipoIva)

--INSERT INTO Ventas.NotaEntregaImpuesto
--(
--        NotaEntregaId
--       ,TaxId
--       ,TaxPercentId
--       ,[Percent]
--       ,TaxBase
--       ,TaxValue
--       ,Discount
--)   

--SELECT  nd.idNotaEntrega
--       ,ti.idImpuesto
--       ,ti.idTipoIva
--       ,ti.porcentaje as [Percent] 
--       ,preciototalSinimpuesto as TaxBase
--       ,valorImpuesto as TaxValue
--       ,nd.valorDescuento as Discount
--FROM NotaEntregaDetalle nd WITH (NOLOCK)
--INNER JOIN TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva = nd.idTipoIva
--order by idNotaEntrega asc

