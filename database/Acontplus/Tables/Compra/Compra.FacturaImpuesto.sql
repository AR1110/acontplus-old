USE Acontplus
GO


CREATE TABLE Compra.FacturaImpuesto (
	 Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
	,FacturaCompraId BIGINT NULL CONSTRAINT fk_FacturaImpuesto_FacturaCompra FOREIGN KEY (FacturaCompraId) REFERENCES dbo.FacturaCompra(idFacturaCompra)
	,TaxId INT NOT NULL CONSTRAINT fk_FacturaImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES dbo.Impuesto(idImpuesto)
	,TaxPercentId INT NOT NULL CONSTRAINT fk_FacturaImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES dbo.TipoIva(idTipoIva)
	,[Percent] NUMERIC(18,5) NOT NULL
	,TaxBase NUMERIC(18,5) NOT NULL
	,[Discount] NUMERIC(18,5) NOT NULL
    ,TaxValue NUMERIC(18,5) NOT NULL
	,CreateAt DATETIME2 NOT NULL DEFAULT GETDATE()
	,UpdatedAt DATETIME2 NULL
	,[Enabled] BIT NOT NULL DEFAULT 1
	,Deleted BIT NULL
	,UserId INT NULL
)
GO
