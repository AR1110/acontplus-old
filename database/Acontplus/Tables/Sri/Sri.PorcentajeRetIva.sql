USE AcontPlus
IF OBJECT_ID(N'Sri.PorcentajeRetIva', N'U') IS NOT NULL
DROP TABLE Sri.PorcentajeRetIva 
GO
CREATE TABLE Sri.PorcentajeRetIva(
idPorcentajeRetIva INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codigo VARCHAR(4) NOT NULL UNIQUE
,descripcion VARCHAR(50) NOT NULL
,porcentaje NUMERIC(6,2)
,estado BIT NOT NULL DEFAULT 1
)