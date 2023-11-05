USE [AcontPlus]
GO


CREATE TABLE Config.Estab_Logo
(
	idEstab_Logo INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,codEstab VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab) ON UPDATE CASCADE
   ,ruc VARCHAR(20) NOT NULL
   ,estab VARCHAR(5) NOT NULL
   ,imagen VARBINARY(MAX) NOT NULL
   ,mimeType VARCHAR(60) NOT NULL
   ,nombreImagen VARCHAR(250) NOT NULL
   ,usuario VARCHAR(100) NOT NULL FOREIGN KEY REFERENCES dbo.Usuario(nombreUsuario)
   ,fechaRegistro DATETIME NOT NULL
   ,estado BIT DEFAULT 1 

)