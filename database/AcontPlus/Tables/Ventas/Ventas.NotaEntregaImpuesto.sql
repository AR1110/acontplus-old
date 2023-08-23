USE Acontplus
GO

ALTER TABLE NotaEntregaDetalle ALTER COLUMN descripcion NVARCHAR(255) NULL

GO

ALTER TABLE NotaEntregaDetalle ALTER COLUMN porcentajeDescuento DECIMAL(15,5) NULL

GO


ALTER TABLE NotaEntregaDetalle ALTER COLUMN idTipoIva INT NULL

GO

ALTER TABLE NotaEntregaDetalle ADD uuid UNIQUEIDENTIFIER NULL

GO

CREATE TABLE Ventas.NotaEntregaImpuesto (
		Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
	,NotaEntregaDetalleId BIGINT NULL CONSTRAINT fk_NotaEntregaImpuesto_NotaEntregaDetalle FOREIGN KEY (NotaEntregaDetalleId) REFERENCES NotaEntregaDetalle (idNotaEntregaDetalle) ON DELETE CASCADE
	,TaxId INT NOT NULL CONSTRAINT fk_NotaEntregaImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES Sri.Impuesto(idImpuesto)
	,TaxPercentId INT NOT NULL CONSTRAINT fk_NotaEntregaImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES Sri.TarifaImpuesto (idTarifaImpuesto)
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
WHERE name = N'IX_NotaEntregaImpuesto_Detail_Tax_TaxPercent')   
    DROP INDEX IX_NotaEntregaImpuesto_Detail_Tax_TaxPercent ON Ventas.NotaEntregaImpuesto
GO

CREATE NONCLUSTERED INDEX [IX_NotaEntregaImpuesto_Detail_Tax_TaxPercent]
ON [Ventas].[NotaEntregaImpuesto] ([NotaEntregaDetalleId] ASC, [TaxId], [TaxPercentId])
INCLUDE ([Id], [Percent], [TaxBase], [TaxValue])
GO