USE Acontplus
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_NotaEntrega')   
    DROP INDEX IX_NotaEntrega ON dbo.NotaEntrega;  
GO
CREATE NONCLUSTERED INDEX IX_NotaEntrega ON dbo.NotaEntrega(idCliente, idPuntoEmision, idTipoDocumento, fechaEmision, idUsuario, idEntidad) INCLUDE (nroDocumento)
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_NotaEntrega_Detalle')   
    DROP INDEX IX_NotaEntrega_Detalle ON dbo.NotaEntregaDetalle;  
GO
CREATE NONCLUSTERED INDEX IX_NotaEntrega_Detalle ON dbo.NotaEntregaDetalle(idNotaEntrega, idArticulo, idBodega, idTarifa, idMedida)
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_NotaEntregaImpuesto_Detail_Tax_TaxPercent')   
    DROP INDEX IX_NotaEntregaImpuesto_Detail_Tax_TaxPercent ON Ventas.NotaEntregaImpuesto
GO

CREATE NONCLUSTERED INDEX [IX_NotaEntregaImpuesto_Detail_Tax_TaxPercent]
ON [Ventas].[NotaEntregaImpuesto] (NotaEntregaId ASC, [TaxId], [TaxPercentId])
INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
GO

