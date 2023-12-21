USE Acontplus
GO

CREATE TABLE Ventas.NotaEntregaImpuesto (
     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
    ,Uuid UNIQUEIDENTIFIER NOT NULL
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

