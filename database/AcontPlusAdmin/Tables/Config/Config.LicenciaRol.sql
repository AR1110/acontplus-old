USE AcontPlusAdmin
GO
CREATE TABLE Config.LicenciaRol(
idLicenciaRol INT NOT NULL CONSTRAINT pk_Licencia_Rol PRIMARY KEY IDENTITY(1,1)
,idRol INT NOT NULL CONSTRAINT fk_Rol_Licencia FOREIGN KEY (idRol) REFERENCES App.Rol(idRol)
,codRol NVARCHAR(10) NOT NULL
,idLicencia INT NOT NULL CONSTRAINT fk_Licencia_Rol FOREIGN KEY (idLicencia) REFERENCES Config.Licencia(idLicencia)
,estado BIT NOT NULL DEFAULT 1
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,idUsuario INT NULL
)
