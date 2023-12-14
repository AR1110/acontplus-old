IF OBJECT_ID(N'Compra.FacturaCompraImpuesto', N'U') IS NOT NULL
DROP TABLE Compra.FacturaCompraImpuesto 
GO
CREATE TABLE Compra.FacturaCompraImpuesto (
	idFac_Comp_Imp INT NOT NULL PRIMARY KEY IDENTITY(1,1)
	,idFac_CompraDetalle INT NOT NULL
	,codigo VARCHAR(50) NOT NULL
	,codigoPorcentaje VARCHAR(5) NULL
	,tarifa NUMERIC(15,5) NULL
	,baseImponible NUMERIC(15,5) NULL
	,valor NUMERIC(15,5) NULL
)
 