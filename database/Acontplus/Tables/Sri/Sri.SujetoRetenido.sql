USE AcontPlus
IF OBJECT_ID(N'Sri.SujetoRetenido', N'U') IS NOT NULL
DROP TABLE Sri.SujetoRetenido 
GO
CREATE TABLE Sri.SujetoRetenido(
idSujetoRetenido INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codigo VARCHAR(5) NOT NULL
,descripcion VARCHAR(150) NOT NULL
,estado BIT NOT NULL DEFAULT 1
)