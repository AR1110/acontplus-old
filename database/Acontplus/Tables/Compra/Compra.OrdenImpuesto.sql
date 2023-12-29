USE Acontplus
GO


CREATE TABLE Compra.OrdenImpuesto (
	 Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
	,OrdenId BIGINT NULL CONSTRAINT fk_OrdenImpuesto_Orden FOREIGN KEY (OrdenId) REFERENCES dbo.OrdenCompra(idOrdenCompra)
	,TaxId INT NOT NULL CONSTRAINT fk_OrdenImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES dbo.Impuesto(idImpuesto)
	,TaxPercentId INT NOT NULL CONSTRAINT fk_OrdenImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES dbo.TipoIva(idTipoIva)
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
