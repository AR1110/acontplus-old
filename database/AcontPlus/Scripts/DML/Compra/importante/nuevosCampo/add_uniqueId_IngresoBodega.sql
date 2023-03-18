use [AcontPlus]
GO


--ALTER TABLE dbo.IngresoBodega ADD uniqueId VARCHAR(20)
--ALTER TABLE dbo.IngresoBodega ALTER COLUMN uniqueId VARCHAR(20) NOT NULL
--ALTER TABLE dbo.IngresoBodega ADD UNIQUE(uniqueId)


--ALTER TABLE dbo.IngresoBodegaDetalle ADD uniqueId VARCHAR(20)
--ALTER TABLE dbo.IngresoBodegaDetalle ALTER COLUMN uniqueId VARCHAR(20) NOT NULL

DECLARE @table  AS TABLE 
(
	 idIngresoBodega INT UNIQUE NOT NULL
	,uniqueId VARCHAR(20) UNIQUE NOT NULL
)

insert into @table (idIngresoBodega,uniqueId)
select 
	 idIngresoBodega
	,uniqueId = 'D'+CAST(DATEPART(YEAR,fechaRegistro)AS varchar)+Helper.F_Auto_Sequential(ROW_NUMBER() OVER (partition BY DATEPART(YEAR,fechaRegistro) order by idIngresoBodega ASC )) 
	from dbo.IngresoBodega 



	--update ib set
	--	ib.uniqueid = t.uniqueId
	--FROM dbo.IngresoBodega ib 
	--INNER JOIN @table t ON t.idIngresoBodega = ib.idIngresoBodega

	--update ibd SET 
	--	ibd.uniqueid = ib.uniqueId
	--FROM dbo.IngresoBodegaDetalle ibd 
	--INNER JOIN IngresoBodega ib ON ib.idIngresoBodega = ibd.idIngresoBodega

	select idIngresoBodega,uniqueId from IngresoBodega 

	select idIngresoBodega,uniqueId from IngresoBodegaDetalle