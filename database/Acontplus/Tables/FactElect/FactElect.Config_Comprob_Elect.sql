--USE [AcontPlus]
--GO

--DROP TABLE FactElect.Config_Comprob_Elect
--GO

CREATE TABLE FactElect.Config_Comprob_Elect
(
	idConfig_Comprob_Elect INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab) NOT NULL
   ,estab VARCHAR(5) NOT NULL
   ,isAutomatic INT DEFAULT 0 NOT NULL
   ,estado BIT DEFAULT 1 NOT NULL
)
