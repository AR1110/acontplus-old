USE Acontplus
GO


CREATE TABLE Compra.DocumentoIngresoImpuesto (
	 Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
	,DocumentoIngresoId INT NOT NULL CONSTRAINT fk_DocumentoIngresoImpuesto_DocumentoIngreso FOREIGN KEY (DocumentoIngresoId) REFERENCES Compra.Documento_Ingreso(idDocumentoIngreso)
	,TaxId INT NOT NULL CONSTRAINT fk_DocumentoIngresoImpuesto_SriImpuesto FOREIGN KEY (TaxId) REFERENCES dbo.Impuesto(idImpuesto)
	,TaxPercentId INT NOT NULL CONSTRAINT fk_DocumentoIngresoImpuesto_SriPorcentajeImpuesto FOREIGN KEY (TaxPercentId) REFERENCES dbo.TipoIva (idTipoIva)
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
