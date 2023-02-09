USE AcontPlus
IF OBJECT_ID(N'Sri.ImpuestoRetencion', N'U') IS NOT NULL
DROP TABLE Sri.ImpuestoRetencion 
GO
CREATE TABLE Sri.ImpuestoRetencion(
idImpuestoRetencion INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,codigo VARCHAR(1) NOT NULL UNIQUE
,descripcion VARCHAR(50) NOT NULL
,estado BIT NOT NULL DEFAULT 1
)