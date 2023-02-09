--CREATE TABLE FactElect.EstadoServicio
--(
--	idEstadoServicio UNIQUEIDENTIFIER DEFAULT NEWID()
--   ,descripcion VARCHAR(100) NOT NULL
--   ,codigo INT UNIQUE NOT NULL
--   ,estado BIT DEFAULT 1
--)

--INSERT INTO FactElect.EstadoServicio(descripcion,codigo)
--SELECT 'PROCESO' descripcion,1 codigo
--union all
--SELECT 'FIRMADO',2
--union all
--SELECT 'VALIDADO',3
--UNION ALL
--SELECT 'AUTORIZADO',4
--union all
--SELECT 'ERROR SRI',5
--union all
--SELECT 'ANULADO ',6
--union all
--SELECT 'ERROR ',0

--UPDATE FactElect.EstadoServicio SET descripcion = 'ANULADO' WHERE codigo = 6

SELECT * FROM FactElect.EstadoServicio


