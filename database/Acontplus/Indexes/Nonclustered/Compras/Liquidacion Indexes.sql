use [Acontplus]
GO 



IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_LiquidacionImpuesto_Tax_TaxPercent')   
    DROP INDEX IX_LiquidacionImpuesto_Tax_TaxPercent ON Compra.LiquidacionImpuesto
GO

CREATE NONCLUSTERED INDEX IX_LiquidacionImpuesto_Tax_TaxPercent
ON Compra.LiquidacionImpuesto (LiquidacionId ASC, [TaxId], [TaxPercentId])
INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
GO