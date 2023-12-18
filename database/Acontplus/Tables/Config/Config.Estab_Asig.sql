USE [AcontPlus]
GO

CREATE TABLE Config.Estab_Asig
(
	idEstab_Asig INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,codEstab_Asig VARCHAR(150) UNIQUE NOT NULL 
   ,idUsuarioRol INT FOREIGN KEY REFERENCES App.UsuarioRol(idUsuarioRol) NOT NULL
   ,codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab) NOT NULL
   ,predeterminado BIT NOT NULL
   ,usuario VARCHAR(100) NOT NULL
   ,fechaRegistro DATETIME NOT NULL
   ,estado BIT DEFAULT 1 NOT NULL

)
