USE Acontplus
GO

ALTER TABLE FacturaDetalle ALTER COLUMN descripcion NVARCHAR(255) NULL
GO

ALTER TABLE FacturaDetalle ALTER COLUMN porcentajeDescuento DECIMAL(15,5) NULL
GO

ALTER TABLE FacturaDetalle ALTER COLUMN idTipoIva INT NULL
GO

ALTER TABLE FacturaDetalle ADD uuid UNIQUEIDENTIFIER NULL
GO

CREATE TABLE Ventas.FacturaImpuesto (
		Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
    ,Uuid UNIQUEIDENTIFIER NOT NULL
	,FacturaDetalleId BIGINT NULL CONSTRAINT fk_FacturaImpuesto_FacturaDetalle FOREIGN KEY (FacturaDetalleId) REFERENCES FacturaDetalle(idFacturaDetalle) ON DELETE CASCADE
	,TaxId INT NOT NULL CONSTRAINT fk_FacturaImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES Sri.Impuesto(idImpuesto)
	,TaxPercentId INT NOT NULL CONSTRAINT fk_FacturaImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES Sri.TarifaImpuesto (idTarifaImpuesto)
	,[Percent] NUMERIC(18,5) NOT NULL
	,TaxBase NUMERIC(18,5) NOT NULL
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
WHERE name = N'IX_FacturaImpuesto_Detail_Tax_TaxPercent')   
    DROP INDEX IX_FacturaImpuesto_Detail_Tax_TaxPercent ON Ventas.FacturaImpuesto
GO

CREATE NONCLUSTERED INDEX [IX_FacturaImpuesto_Detail_Tax_TaxPercent]
ON [Ventas].[FacturaImpuesto] ([FacturaDetalleId] ASC, [TaxId], [TaxPercentId])
INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
GO