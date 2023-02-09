USE [AcontPlus]
GO 

CREATE TABLE Sri.AgenteRetencion
(
	idAgenteRetencion INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,resolucion VARCHAR(150) UNIQUE NOT NULL
   ,descripcion VARCHAR(300) NOT NULL
   ,estado BIT DEFAULT 1 NOT NULL

)