use [Acontplus]
go 

ALTER TABLE dbo.Proforma ADD CONSTRAINT FK_proforma_idUsuario FOREIGN KEY(idUsuario) REFERENCES dbo.Usuario(idUsuario)

ALTER TABLE dbo.Proforma ADD CONSTRAINT FK_proforma_idEntidad FOREIGN KEY(idEntidad) REFERENCES dbo.Entidad(idEntidad)