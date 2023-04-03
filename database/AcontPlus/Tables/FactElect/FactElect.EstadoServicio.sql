USE AcontPlus
GO
IF OBJECT_ID('FactElect.EstadoServicio') IS NOT NULL
DROP TABLE FactElect.EstadoServicio
GO

CREATE TABLE FactElect.EstadoServicio(
idEstadoServicio INT NOT NULL CONSTRAINT fk_estado_servico PRIMARY KEY IDENTITY(1,1)
,codigo INT NOT NULL UNIQUE
,descripcion VARCHAR(100) NOT NULL
,estado BIT NOT NULL DEFAULT 1 
)

GO

INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('ERROR', 0)
INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('PROCESO', 1)
INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('FIRMADO', 2)
INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('VALIDADO', 3)
INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('AUTORIZADO', 4)
INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('ERRORSRI', 5)
INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('ANULADO', 6)
INSERT INTO FactElect.EstadoServicio(descripcion, codigo)VALUES('SRIOFFLINE', 7)