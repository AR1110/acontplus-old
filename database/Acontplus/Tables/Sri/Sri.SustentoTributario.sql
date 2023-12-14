USE AcontPlus
IF OBJECT_ID(N'Sri.SustentoTributario', N'U') IS NOT NULL
DROP TABLE Sri.SustentoTributario 
GO
CREATE TABLE Sri.SustentoTributario(
idSustentoTrib INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codSustento VARCHAR(5) NOT NULL UNIQUE
,descripcion VARCHAR(300) NOT NULL
,fechaInicio DATETIME NULL
,fechaFin DATETIME NULL
,estado BIT NOT NULL DEFAULT 1
)