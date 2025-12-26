USE Acontplus
GO
DROP VIEW IF EXISTS Inventario.v_Familia
GO
DROP VIEW IF EXISTS Config.v_Estab_Asign
GO
ALTER TABLE Sri.Establecimiento
DROP CONSTRAINT IF EXISTS FK__Estableci__activ__66E846D9;
GO

ALTER TABLE Sri.ActividadEconomica ALTER COLUMN codigo VARCHAR(9) NOT NULL
GO

ALTER TABLE Sri.ActividadEconomica ALTER COLUMN descripcion VARCHAR(500) NOT NULL
GO

ALTER TABLE Sri.ActividadEconomica ADD codGrupo VARCHAR(9) NULL
GO

ALTER TABLE Sri.ActividadEconomica ADD fechaRegistro DATETIME2 NULL
GO

ALTER TABLE Sri.ActividadEconomica ADD CONSTRAINT ae_default_created_at 
DEFAULT GETDATE() FOR fechaRegistro 
GO


ALTER TABLE Sri.ActividadEconomica ADD idUsuario INT NULL
GO 

ALTER TABLE Sri.Establecimiento ALTER COLUMN actividad VARCHAR(9) NOT NULL
GO

ALTER TABLE Sri.Establecimiento ADD idActividadEconomica INT NULL
GO

ALTER TABLE Sri.Establecimiento ADD CONSTRAINT fk_estab_actividad_economica 
FOREIGN KEY (idActividadEconomica) REFERENCES Sri.ActividadEconomica(idActividadEconomica)
GO

UPDATE e SET e.idActividadEconomica = ae.idActividadEconomica
FROM Sri.Establecimiento e 
    INNER JOIN Sri.ActividadEconomica ae ON e.actividad = ae.codigo

GO

ALTER TABLE Sri.Establecimiento ALTER COLUMN idActividadEconomica INT NOT NULL
GO

---EJECUTAR VISTAS OTRA VEZ
---REVISAR SP DE ESTABLECIMIENTO INSERT Y UPDATE