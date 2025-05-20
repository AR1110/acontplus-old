use [Acontplus]
go 


ALTER TABLE dbo.NotaEntrega ADD CONSTRAINT FK_notaEntrega_idUsuario FOREIGN KEY(idUsuario) REFERENCES dbo.Usuario(idUsuario)

ALTER TABLE dbo.NotaEntrega ADD CONSTRAINT FK_notaEntrega_idEntidad FOREIGN KEY(idEntidad) REFERENCES dbo.Entidad(idEntidad)