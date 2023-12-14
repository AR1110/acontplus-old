USE Acontplus
GO

ALTER TABLE Sri.Establecimiento ADD autoSriAuth BIT NULL DEFAULT 0
GO

UPDATE e SET e.autoSriAuth = fce.isAutomatic
FROM Sri.Establecimiento e
	JOIN (SELECT codEstab, isAutomatic FROM factElect.Config_Comprob_Elect) AS fce ON  e.codEstab = fce.codEstab
GO

ALTER TABLE Sri.Establecimiento ALTER COLUMN autoSriAuth BIT NOT NULL
GO

