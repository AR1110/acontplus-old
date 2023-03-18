use [AcontPlus]
go 

 --ALTER TABLE LiquidacionCompra ADD uniqueId VARCHAR(20)
 --ALTER TABLE LiquidacionCompra ALTER COLUMN uniqueId VARCHAR(20) NOT NULL
 --ALTER TABLE LiquidacionCompra ADD UNIQUE(uniqueId) 
 declare @table AS TABLE(
	 idLiquidacionCompra INT NOT NULL
	,uniqueId VARCHAR(20) NOT NULL UNIQUE
 )

INSERT INTO @table (idLiquidacionCompra,uniqueId)
SELECT 
       idLiquidacionCompra
	  ,uniqueId = 'L'+ CAST(DATEPART(YEAR,fechaRegistro) AS varchar)+Helper.F_Auto_Sequential(ROW_NUMBER() OVER (PARTITION BY DATEPART(YEAR,fechaRegistro) ORDER BY idLiquidacionCompra  ASC))
FROM LiquidacionCompra

UPDATE lc set
	lc.uniqueId = t.uniqueId
FROM LiquidacionCompra lc
INNER JOIN @table t ON t.idLiquidacionCompra = lc.idLiquidacionCompra



