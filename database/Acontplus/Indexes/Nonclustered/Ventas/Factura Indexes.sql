USE AcontPlus;  
GO
--ELIMINAR ---
IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_EntidadId')   
    DROP INDEX IX_Factura_EntidadId ON Factura;  
GO
IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_PuntoEmisionId')   
    DROP INDEX IX_Factura_PuntoEmisionId ON Factura;  
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_Factura_TipoDocumentoId')   
    DROP INDEX IX_Factura_TipoDocumentoId ON Factura;  
GO

  
IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Factura_IdCliente')   
    DROP INDEX IX_Factura_IdCliente ON Factura;  
GO  

--USAR NUEVAS

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Factura')   
    DROP INDEX IX_Factura ON dbo.Factura;  
GO
CREATE NONCLUSTERED INDEX IX_Factura ON dbo.Factura(idCliente, idPuntoEmision, idTipoDocumento, fechaEmision, claveAcceso, idUsuario, idEntidad)
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Factura_Detalle')   
    DROP INDEX IX_Factura_Detalle ON dbo.FacturaDetalle;  
GO
CREATE NONCLUSTERED INDEX IX_Factura_Detalle ON dbo.FacturaDetalle(idFactura, idArticulo, idBodega, idTarifa, idMedida)
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_FacturaImpuesto_Detail_Tax_TaxPercent')   
    DROP INDEX IX_FacturaImpuesto_Detail_Tax_TaxPercent ON Ventas.FacturaImpuesto
GO

CREATE NONCLUSTERED INDEX [IX_FacturaImpuesto_Detail_Tax_TaxPercent]
ON [Ventas].[FacturaImpuesto] (FacturaId ASC, [TaxId], [TaxPercentId])
INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
GO
