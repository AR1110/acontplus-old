USE [AcontPlus]
GO

--ALTER TABLE dbo.GuiaRemision ALTER COLUMN idTipoAmbiente INT NULL
--ALTER TABLE dbo.GuiaRemision ALTER COLUMN idTipoContribuyente INT NULL


--ALTER TABLE dbo.GuiaRemision ADD ambiente VARCHAR(5)

--UPDATE gr SET 
--	gr.ambiente = a.codigo
--FROM GuiaRemision gr 
--INNER JOIN dbo.TipoAmbiente a ON gr.idTipoAmbiente = a.idTipoAmbiente

--ALTER TABLE dbo.GuiaRemision ALTER COLUMN ambiente VARCHAR(5) NOT NULL

Select * from GuiaRemision