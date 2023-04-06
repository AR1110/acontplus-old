

USE AcontPlus;

CREATE TABLE Config.Acction_Article_User (
	idAcctionArticleUser INT PRIMARY KEY IDENTITY (1,1) NOT NULL
	,idUsuario INT NOT NULL CONSTRAINT PK_User FOREIGN KEY REFERENCES dbo.Usuario(idUsuario)
	
)

