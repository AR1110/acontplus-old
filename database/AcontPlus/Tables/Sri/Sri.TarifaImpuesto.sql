USE AcontPlus
IF OBJECT_ID(N'Sri.TarifaImpuesto', N'U') IS NOT NULL
DROP TABLE Sri.TarifaImpuesto 
GO
CREATE TABLE Sri.TarifaImpuesto(
idTarifaImpuesto INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codImpuesto VARCHAR(1) NOT NULL
,codigo VARCHAR(4) NOT NULL UNIQUE
,descripcion VARCHAR(50) NOT NULL
,porcentaje NUMERIC(4,2)
,estado BIT NOT NULL DEFAULT 1
)