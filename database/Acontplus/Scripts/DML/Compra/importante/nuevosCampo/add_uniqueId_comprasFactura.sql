 USE [AcontPlus]
 GO
 
 --ALTER TABLE FacturaCompra ADD uniqueId VARCHAR(20)
 --ALTER TABLE FacturaCompra ALTER COLUMN uniqueId VARCHAR(20) NOT NULL
 --ALTER TABLE FacturaCompra ADD UNIQUE(uniqueId) 
 declare @table AS TABLE(
	 idFacturaCompra INT NOT NULL
	,uniqueId VARCHAR(20) NOT NULL UNIQUE
 )



 INSERT INTO @table (idFacturaCompra,uniqueId)
  SELECT 
	 idFacturaCompra 
	,uniqueId = 'F'+CAST(DATEPART(YEAR,fc.fechaRegistro) as varchar)+Helper.F_Auto_Sequential(ROW_NUMBER() OVER (PARTITION BY DATEPART(YEAR,fc.fechaRegistro) ORDER BY idFacturaCompra ASC)) 
	
FROM FacturaCompra fc
INNER JOIN Proveedor p ON p.idProveedor = fc.idProveedor
INNER JOIN Sri.Establecimiento e ON e.codEstab = fc.codEstab


UPDATE fc set
	fc.uniqueid = t.uniqueId
FROM FacturaCompra fc
INNER JOIN @table t ON t.idFacturaCompra = fc.idFacturaCompra


--select * from facturacompra