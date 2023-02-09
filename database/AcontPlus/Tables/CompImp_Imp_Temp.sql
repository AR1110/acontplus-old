IF OBJECT_ID(N'FactElect.CompImp_Imp_Temp', N'U') IS NOT NULL
DROP TABLE FactElect.CompImp_Imp_Temp 
GO
CREATE TABLE FactElect.CompImp_Imp_Temp (
	idComp UNIQUEIDENTIFIER
	,codArticulo VARCHAR(50)
	,codigo VARCHAR(50)
	,codigoPorcentaje VARCHAR(50)
	,tarifa VARCHAR(50)
	,baseImponible VARCHAR(50)
	,valor VARCHAR(50)
)