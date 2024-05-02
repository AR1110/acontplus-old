USE [Acontplus]
go 

CREATE TABLE Mechanical.SupportDocument
(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,SupportId INT NOT NULL CONSTRAINT FK_SupportId_Support FOREIGN KEY (SupportId) REFERENCES Mechanical.Support(Id)
   ,TipoDocumentoId BIGINT NOT NULL CONSTRAINT FK_TipoDocumentoId_TipoDocumento FOREIGN KEY (TipoDocumentoId) REFERENCES dbo.TipoDocumento(idTipoDocumento)
   ,UserId INT NOT NULL CONSTRAINT FK_UserId_Usuario FOREIGN KEY (UserId) REFERENCES dbo.Usuario(idUsuario)
   ,DocumentoId INT NOT NULL
   ,SerieComprobante VARCHAR(25) NOT NULL
   ,CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
   ,UpdatedAt DATETIME2 NULL
   ,[Enabled] BIT NOT NULL DEFAULT 1
   ,Deleted BIT NULL
)


