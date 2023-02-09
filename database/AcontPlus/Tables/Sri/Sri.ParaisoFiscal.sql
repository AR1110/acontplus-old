USE AcontPlus
IF OBJECT_ID(N'Sri.ParaisoFiscal', N'U') IS NOT NULL
DROP TABLE Sri.ParaisoFiscal 
GO
CREATE TABLE Sri.ParaisoFiscal(
idParaisoFiscal INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codigo VARCHAR(5) NOT NULL
,descripcion VARCHAR(150) NOT NULL
,fechaInicio DATETIME NULL
,fechaFin DATETIME NULL
,estado BIT NOT NULL DEFAULT 1
)