USE Acontplus
GO


CREATE TABLE Ventas.NotaCreditoImpuesto (
	 Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
	,NotaCreditoId BIGINT NOT NULL CONSTRAINT fk_NotaCreditoImpuesto_NotaCredito FOREIGN KEY (NotaCreditoId) REFERENCES dbo.NotaCredito(idNotaCredito)
	,TaxId INT NOT NULL CONSTRAINT fk_NotaCreditoImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES dbo.Impuesto(idImpuesto)
	,TaxPercentId INT NOT NULL CONSTRAINT fk_NotaCreditoImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES dbo.TipoIva (idTipoIva)
	,[Percent] NUMERIC(18,5) NOT NULL
	,TaxBase NUMERIC(18,5) NOT NULL
    ,Discount NUMERIC(18,5) NOT NULL
	,TaxValue NUMERIC(18,5) NOT NULL
	,CreateAt DATETIME2 NOT NULL DEFAULT GETDATE()
	,UpdatedAt DATETIME2 NULL
	,[Enabled] BIT NOT NULL DEFAULT 1
	,Deleted BIT NULL
	,UserId INT NULL
)
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_NotaCreditoImpuesto_Tax_TaxPercent')   
    DROP INDEX IX_NotaCreditoImpuesto_Tax_TaxPercent ON Ventas.NotaCreditoImpuesto
GO

CREATE NONCLUSTERED INDEX IX_NotaCreditoImpuesto_Tax_TaxPercent
ON Ventas.NotaCreditoImpuesto (NotaCreditoId ASC, [TaxId], [TaxPercentId])
INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
GO