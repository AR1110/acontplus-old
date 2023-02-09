USE [AcontPlus]
GO 

CREATE TABLE Sri.PtoEmision
(
	idPtoEmision INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,codPtoEmi VARCHAR(50) UNIQUE NOT NULL
   ,codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab) NOT NULL
   ,ambiente VARCHAR(5) FOREIGN KEY REFERENCES Sri.Ambiente(codigo) NOT NULL 
   ,ruc VARCHAR(15) NOT NULL 
   ,estab VARCHAR(5) NOT NULL
   ,ptoEmi VARCHAR(5) NOT NULL
   ,usuario VARCHAR(100) NOT NULL FOREIGN KEY REFERENCES dbo.Usuario(nombreUsuario) 
   ,fechaRegistro DATETIME NOT NULL
   ,estado BIT DEFAULT 1 
)