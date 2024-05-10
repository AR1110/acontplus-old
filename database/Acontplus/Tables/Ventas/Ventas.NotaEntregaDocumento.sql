use [Acontplus]
go

CREATE TABLE Ventas.NotaEntregaDocumento(
	 Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,NotaEntregaId BIGINT NOT NULL CONSTRAINT PK_NotaEntregaDocumento__NotaEntregaId FOREIGN KEY(NotaEntregaId) REFERENCES dbo.NotaEntrega(idNotaEntrega)
	,TipoDocumentoId BIGINT NOT NULL  CONSTRAINT PK_NotaEntregaDocumento_TipoDocumentoId FOREIGN KEY(TipoDocumentoId) REFERENCES dbo.TipoDocumento(idTipoDocumento)
	,UsuarioId INT NOT NULL CONSTRAINT PK_NotaEntregaDocumento_UsuarioId FOREIGN KEY(UsuarioId) REFERENCES dbo.Usuario(idUsuario)
	,DocumentoId INT NOT NULL 
	,SerieComprobante VARCHAR(50) NOT NULL
	,FechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE()
	,Estado BIT NOT NULL DEFAULT 1 
	,Eliminado BIT NULL
)