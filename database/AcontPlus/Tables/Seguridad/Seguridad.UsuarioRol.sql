USE AcontPlus
GO
CREATE TABLE Seguridad.UsuarioRol(
idUsuarioRol INT NOT NULL CONSTRAINT pk_usuario_rol PRIMARY KEY IDENTITY (1,1)
,idUsuario INT NOT NULL CONSTRAINT fk_usuario_rol FOREIGN KEY (idUsuario) REFERENCES Seguridad.Usuario(idUsuario)
,idRol INT NOT NULL CONSTRAINT fk_rol_usuario FOREIGN KEY (idRol) REFERENCES Seguridad.Rol(idRol)
,idEntidad INT NOT NULL --CONSTRAINT fk_entidad_u_rol FOREIGN KEY (idEntidad) REFERENCES Entidad(idEntidad)
,registro DATETIME NOT NULL DEFAULT GETDATE()
,estado BIT NOT NULL DEFAULT 1
,predeterminado BIT NOT NULL DEFAULT 1
)