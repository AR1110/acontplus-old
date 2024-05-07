use [Acontplus]
go

CREATE TABLE Ventas.ProformaDocumento(
	 Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,ProformaId BIGINT NOT NULL CONSTRAINT PK_ProformaDocumento__ProformaId FOREIGN KEY(ProformaId) REFERENCES dbo.Proforma(idProforma)
	,TipoDocumentoId BIGINT NOT NULL  CONSTRAINT PK_ProformaDocumento_TipoDocumentoId FOREIGN KEY(TipoDocumentoId) REFERENCES dbo.TipoDocumento(idTipoDocumento)
	,UsuarioId INT NOT NULL CONSTRAINT PK_ProformaDocumento_UsuarioId FOREIGN KEY(UsuarioId) REFERENCES dbo.Usuario(idUsuario)
	,DocumentoId INT NOT NULL 
	,SerieComprobante VARCHAR(50) NOT NULL
	,FechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE()
	,Estado BIT NOT NULL DEFAULT 1 
	,Eliminado BIT NULL
)