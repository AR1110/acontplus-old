USE AcontPlus
IF OBJECT_ID(N'Sri.DocumentoSustentoTrib', N'U') IS NOT NULL
DROP TABLE Sri.DocumentoSustentoTrib 
GO
CREATE TABLE Sri.DocumentoSustentoTrib(
idDocSustentoTrib INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codDocSustento VARCHAR(5) NOT NULL
,codSustento VARCHAR(5) NOT NULL
,estado BIT NOT NULL DEFAULT 1
)