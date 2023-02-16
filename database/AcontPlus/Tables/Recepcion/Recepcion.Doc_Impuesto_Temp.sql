USE AcontPlus
GO
IF OBJECT_ID(N'Recepcion.Doc_Impuesto_Temp', N'U') IS NOT NULL
DROP TABLE Recepcion.Doc_Impuesto_Temp 
GO
CREATE TABLE Recepcion.Doc_Impuesto_Temp (
	idDocumento INT
	,codArticulo VARCHAR(50)
	,codigo VARCHAR(50)
	,codigoPorcentaje VARCHAR(50)
	,tarifa VARCHAR(50)
	,baseImponible VARCHAR(50)
	,valor VARCHAR(50)
)