

USE AcontPlus;

CREATE TABLE Config.UserPermission (
	idUserPermission INT PRIMARY KEY IDENTITY (1,1) NOT NULL
	,idUsuario INT NOT NULL CONSTRAINT PK_User FOREIGN KEY REFERENCES dbo.Usuario(idUsuario)
	,codModule VARCHAR(5) NOT NULL
	,jsonData VARCHAR(MAX)
)



