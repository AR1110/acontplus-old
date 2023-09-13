use [Acontplus]
go 


--ALTER TABLE dbo.Familia ADD ActividadEconomicaId INT 

--ALTER TABLE dbo.Familia ADD CONSTRAINT FK_Familia_ActividadEconomica_idActividadEconomica FOREIGN KEY (ActividadEconomicaId) REFERENCES Sri.ActividadEconomica(idActividadEconomica) 

--ALTER TABLE dbo.Familia ALTER COLUMN descripcion VARCHAR(150) NOT NULL