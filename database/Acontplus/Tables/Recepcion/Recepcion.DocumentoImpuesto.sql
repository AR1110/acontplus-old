USE Acontplus
GO


CREATE TABLE Recepcion.DocumentoImpuesto (
	 Id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
	,DocumentoRecibidoId INT NULL CONSTRAINT fk_DocumentoImpuesto_Documento FOREIGN KEY (DocumentoRecibidoId) REFERENCES Recepcion.DocumentoRecibido(idDocumento)
	,[Discount] NUMERIC(18,5) NOT NULL
	,Code VARCHAR(10) NOT NULL
	,CodePercentage VARCHAR(10) NOT NULL
	,Fee NUMERIC(18,5) NOT NULL
	,TaxBase NUMERIC(18,5) NOT NULL
    ,TaxValue NUMERIC(18,5) NOT NULL
	,CreateAt DATETIME2 NOT NULL DEFAULT GETDATE()
	,UpdatedAt DATETIME2 NULL
	,[Enabled] BIT NOT NULL DEFAULT 1
	,Deleted BIT NULL
	,UserId INT NULL
)
GO
