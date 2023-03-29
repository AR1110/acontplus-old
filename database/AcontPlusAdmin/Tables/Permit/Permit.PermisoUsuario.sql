USE AcontPlusAdmin
GO
CREATE TABLE Permit.PermisoUsuario(
idPermisoUsuario INT NOT NULL CONSTRAINT pk_PermisoUsuario PRIMARY KEY IDENTITY(1,1)
,idUsuarioRol INT NOT NULL CONSTRAINT fk_pu_ur FOREIGN KEY (idUsuarioRol) REFERENCES App.UsuarioRol(idUsuarioRol)
,idAccesoAccion INT NOT NULL CONSTRAINT fk_pu_aa FOREIGN KEY (idAccesoAccion) REFERENCES Permit.AccesoAccion(idAccesoAccion)
,estado BIT NOT NULL DEFAULT 1
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
)