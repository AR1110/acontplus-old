USE Acontplus
GO


CREATE TABLE Ventas.ProformaImpuesto (
	 Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
	,ProformaId BIGINT NOT NULL CONSTRAINT fk_ProformaImpuesto_Proforma FOREIGN KEY (ProformaId) REFERENCES dbo.Proforma(idProforma)
	,TaxId INT NOT NULL CONSTRAINT fk_ProformaImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES dbo.Impuesto(idImpuesto)
	,TaxPercentId INT NOT NULL CONSTRAINT fk_ProformaImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES dbo.TipoIva (idTipoIva)
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
WHERE name = N'IX_ProformaImpuesto_Tax_TaxPercent')   
    DROP INDEX IX_ProformaImpuesto_Tax_TaxPercent ON Ventas.ProformaImpuesto
GO

CREATE NONCLUSTERED INDEX IX_ProformaImpuesto_Tax_TaxPercent
ON Ventas.ProformaImpuesto (ProformaId ASC, [TaxId], [TaxPercentId])
INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
GO