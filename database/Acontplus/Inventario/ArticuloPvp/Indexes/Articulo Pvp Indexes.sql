USE Acontplus
GO;

--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_ArticuloPvp_Tarifa')   
--    DROP INDEX idx_ArticuloPvp_Tarifa ON dbo.ArticuloPvp;  
--GO

--CREATE NONCLUSTERED INDEX idx_ArticuloPvp_Tarifa
--ON dbo.ArticuloPvp(idTarifa)
--INCLUDE(idArticulo,precioConIva)


--UPDATE STATISTICS dbo.ArticuloPvp WITH FULLSCAN;
--GO

--ALTER INDEX ALL ON dbo.ArticuloPvp REBUILD;
--GO