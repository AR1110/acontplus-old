use [Acontplus]
go 

--ALTER TABLE Ventas.FacturaImpuesto ADD FacturaId BIGINT NOT NULL

--ALTER TABLE Ventas.FacturaImpuesto ADD Discount NUMERIC(15,5) NOT NULL


--ALTER TABLE Ventas.FacturaImpuesto DROP COLUMN Uuid 

--ALTER TABLE Ventas.FacturaImpuesto DROP CONSTRAINT [fk_FacturaImpuesto_FacturaDetalle]

--ALTER TABLE Ventas.FacturaImpuesto DROP CONSTRAINT [fk_FacturaImpuesto_SriImpuesto]

--ALTER TABLE Ventas.FacturaImpuesto DROP CONSTRAINT [fk_FacturaImpuesto_SriPorcentajeImpuesto]

--ALTER TABLE Ventas.FacturaImpuesto DROP COLUMN [FacturaDetalleId]

--ALTER TABLE Ventas.FacturaImpuesto ADD CONSTRAINT fk_Factura FOREIGN KEY (FacturaId) REFERENCES dbo.Factura(idFactura)

--ALTER TABLE Ventas.FacturaImpuesto ADD CONSTRAINT fk_SriImpuesto FOREIGN KEY (TaxId) REFERENCES dbo.Impuesto(idImpuesto)

--ALTER TABLE Ventas.FacturaImpuesto ADD CONSTRAINT fk_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES dbo.TipoIva(idTipoIva)

--INSERT INTO Ventas.FacturaImpuesto
--(
--        FacturaId
--       ,TaxId
--       ,TaxPercentId
--       ,[Percent]
--       ,TaxBase
--       ,TaxValue
--       ,Discount
--)   

--SELECT  fd.idFactura
--       ,ti.idImpuesto
--       ,ti.idTipoIva
--       ,porcentajeIva as [Percent] 
--       ,total as TaxBase
--       ,iva as TaxValue
--       ,fd.valorDescuento as Discount
--FROM FacturaDetalle fd WITH (NOLOCK)
--INNER JOIN TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva = fd.idTipoIva
--INNER JOIN Impuesto im with (nolock) on im.idImpuesto = ti.idImpuesto
--order by idFactura asc



