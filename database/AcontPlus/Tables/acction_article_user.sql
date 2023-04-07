

USE AcontPlus;

IF OBJECT_ID('Config.UserPermission') IS NOT NULL
DROP TABLE Config.UserPermission

CREATE TABLE Config.UserPermission (
	idUserPermission INT PRIMARY KEY IDENTITY (1,1) NOT NULL
	,idUsuarioRol INT NOT NULL CONSTRAINT PK_UsuarioRol FOREIGN KEY (idUsuarioRol) REFERENCES App.UsuarioRol(idUsuarioRol)	
	,codModule VARCHAR(5) NOT NULL
	,jsonPermission VARCHAR(MAX)
	,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
	,estado BIT NOT NULL DEFAULT 1	
)

--
SELECT * FROM  Config.UserPermission



