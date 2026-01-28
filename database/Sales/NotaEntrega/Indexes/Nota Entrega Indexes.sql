USE Acontplus
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_NotaEntrega')   
    DROP INDEX IX_NotaEntrega ON dbo.NotaEntrega;  
GO
    CREATE NONCLUSTERED INDEX IX_NotaEntrega
    ON dbo.NotaEntrega(idCliente, idPuntoEmision, idUsuario, idEntidad)
    INCLUDE (fechaEmision, nroDocumento, estado,convertToDoc)
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



