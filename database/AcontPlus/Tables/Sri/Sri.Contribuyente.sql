USE [AcontPlus]
go

--DROP TABLE Sri.Contribuyente
--go

CREATE TABLE Sri.Contribuyente
(
	idContribuyente INT IDENTITY(1,1) NOT NULL PRIMARY KEY
   ,regimen VARCHAR(10) NOT NULL FOREIGN KEY REFERENCES Sri.Regimen(codigo) ON UPDATE CASCADE
   ,codigo VARCHAR(5) UNIQUE NOT NULL
   ,descripcion VARCHAR(100) NOT NULL
   ,contribuyenteRimpe VARCHAR(150) NULL
   ,estado BIT DEFAULT 1 
)	
