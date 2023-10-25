USE [AcontPlus]
GO

--ALTER TABLE dbo.RetencionCompra ALTER COLUMN idTipoAmbiente INT NULL
---ALTER TABLE dbo.RetencionCompra ALTER COLUMN idTipoContribuyente INT NULL
--ALTER TABLE dbo.RetencionCompra ADD ambiente VARCHAR(5)

--UPDATE r set
--r.ambiente = ta.codigo
--FROM RetencionCompra r 
--INNER JOIN dbo.TipoAmbiente ta ON ta.idtipoambiente = r.idtipoambiente

---ALTER TABLE dbo.RetencionCompra ALTER COLUMN ambiente VARCHAR(5) NOT NULL
select * from RetencionCompra