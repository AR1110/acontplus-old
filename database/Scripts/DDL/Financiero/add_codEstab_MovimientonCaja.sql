use [AcontPlus]
go

--ALTER TABLE dbo.MovimientoCaja ADD codEstab VARCHAR(50) FOREIGN KEY REFERENCES Sri.Establecimiento(codEstab)
--ALTER TABLE dbo.MovimientoCaja ALTER COLUMN idSucursal INT NULL

--UPDATE mc SET	
--	mc.codEstab = s.codEstab
--FROM dbo.MovimientoCaja mc 
--INNER JOIN dbo.Sucursal s ON s.idSucursal = mc.idSucursal

--ALTER TABLE dbo.MovimientoCaja ALTER COLUMN codEstab VARCHAR(50) NOT NULL

DECLARE @table TABLE 
(	
	idMovimientoCaja VARCHAR(50)
   ,secuencial INT
)
INSERT INTO @table (idMovimientoCaja,secuencial)
select idMovimientoCaja ,secuencial = ROW_NUMBER() OVER (PARTITION  BY idSucursal,idTipoDocumento ORDER BY idSucursal ASC) from MovimientoCaja  order by idSucursal ASC



--UPDATE mc SET	
--	mc.nroDoc = t.secuencial
--FROM MovimientoCaja mc 
--INNER JOIN @table t ON t.idMovimientoCaja = mc.idMovimientoCaja

select * from dbo.MovimientoCaja
