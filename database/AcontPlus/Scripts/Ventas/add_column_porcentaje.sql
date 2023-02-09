USE[AcontPlus]
go

--ALTER TABLE dbo.Factura ADD porcentaje DECIMAL(15,5) NULL
--ALTER TABLE dbo.Factura ADD ambiente VARCHAR(5) NULL
--ALTER TABLE dbo.Factura ALTER COLUMN idTipoContribuyente INT NULL
--ALTER TABLE dbo.Factura ALTER COLUMN idTipoAmbiente INT NULL
--ALTER TABLE dbo.Factura ALTER COLUMN idTipoIva INT NULL

--UPDATE f SET
--	f.porcentaje = ti.porcentaje
--   ,f.ambiente = cast( ta.codigo as varchar)
--  FROM Factura f 
--INNER JOIN TipoIva ti ON ti.idTipoIva = f.idTipoIva
--INNER JOIN dbo.TipoAmbiente ta ON ta.idTipoAmbiente = f.idTipoAmbiente

--ALTER TABLE dbo.Factura ALTER COLUMN porcentaje DECIMAL(15,5) NOT NULL
--ALTER TABLE dbo.Factura ALTER COLUMN ambiente VARCHAR(5)  NOT NULL

select * from dbo.Factura
 
