USE [AcontPlus]
GO

CREATE TABLE Catalogo.Provincia
(
	idProvincia INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,codigo VARCHAR(10) UNIQUE NOT NULL
   ,descripcion VARCHAR(200) NOT NULL
   ,estado BIT DEFAULT 1 NOT NULL 
)