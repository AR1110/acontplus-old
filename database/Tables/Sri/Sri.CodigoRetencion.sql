USE AcontPlus
IF OBJECT_ID(N'Sri.CodigoRetencion', N'U') IS NOT NULL
DROP TABLE Sri.CodigoRetencion 
GO
CREATE TABLE Sri.CodigoRetencion(
idCodigoRetencion INT NOT NULL PRIMARY KEY IDENTITY(1,1)
,modulo VARCHAR(50) NULL
,codigo VARCHAR(5) NOT NULL
,concepto VARCHAR(300) NOT NULL
,porcentajeMin NUMERIC (18,2) NULL
,porcentajeMax NUMERIC (18, 2) NULL
,estado BIT NOT NULL DEFAULT 1
)