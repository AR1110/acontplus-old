USE [AcontPlus]
GO

CREATE TABLE Sri.ActividadEconomica
(
	idActividadEconomica INT NOT NULL IDENTITY(1,1) 
   ,codigo VARCHAR(5) UNIQUE NOT NULL
   ,codTarifaImpuesto VARCHAR(4) NOT NULL FOREIGN KEY REFERENCES Sri.TarifaImpuesto(codigo)
   ,porcentaje DECIMAL(15,5) NOT NULL
   ,descripcion VARCHAR(200) NOT NULL
   ,grupo VARCHAR(500) NOT NULL
   ,estado BIT DEFAULT 1 NOT NULL
)