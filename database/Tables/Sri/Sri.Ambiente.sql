USE [AcontPlus]
GO 


CREATE TABLE Sri.Ambiente
(
	idAmbiente INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,codigo VARCHAR(5) NOT NULL UNIQUE 
   ,descripcion VARCHAR(50) NOT NULL
   ,estado BIT DEFAULT 1
)