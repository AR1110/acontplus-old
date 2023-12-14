USE AcontPlus
IF OBJECT_ID(N'Sri.DocumentoSustento', N'U') IS NOT NULL
DROP TABLE Sri.DocumentoSustento 
GO
CREATE TABLE Sri.DocumentoSustento(
idDocSustento INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codDocSustento VARCHAR(5) NOT NULL UNIQUE
,descripcion VARCHAR(300) NOT NULL
,fechaVigencia DATETIME NULL
,sustentos VARCHAR(50) NULL
,estado BIT NOT NULL DEFAULT 1
)