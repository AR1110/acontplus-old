USE AcontPlus;  
GO  
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Factura')   
    DROP INDEX IX_Factura ON dbo.Factura;  
GO
    CREATE NONCLUSTERED INDEX IX_Factura
    ON dbo.Factura(idCliente, idUsuario,idDocumentoElectronico)
    INCLUDE (estado)
GO

--IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Factura_Detalle')   
--    DROP INDEX IX_Factura_Detalle ON dbo.FacturaDetalle;  
--GO
--    CREATE NONCLUSTERED INDEX IX_Factura_Detalle ON dbo.FacturaDetalle(idFactura, idArticulo, idBodega, idTarifa, idMedida)
--GO

--IF EXISTS (SELECT name
--FROM sys.indexes
--WHERE name = N'IX_FacturaImpuesto_Detail_Tax_TaxPercent')   
--    DROP INDEX IX_FacturaImpuesto_Detail_Tax_TaxPercent ON Ventas.FacturaImpuesto
--GO
--    CREATE NONCLUSTERED INDEX [IX_FacturaImpuesto_Detail_Tax_TaxPercent]
--    ON [Ventas].[FacturaImpuesto] (FacturaId ASC, [TaxId], [TaxPercentId])
--    INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
--GO
