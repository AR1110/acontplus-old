USE Acontplus
GO

--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_Config_Sistema')   
--    DROP INDEX idx_Config_Sistema ON Config.Sistema;  
--GO

--CREATE NONCLUSTERED INDEX idx_Config_Sistema
--ON Config.Sistema (idEntidad, codConfig)

--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_Config_Sistema_CodConfig')   
--    DROP INDEX idx_Config_Sistema_CodConfig ON Config.Sistema;  
--GO

--CREATE NONCLUSTERED INDEX idx_Config_Sistema_CodConfig
--ON Config.Sistema (codConfig)
--INCLUDE (idEntidad,jsonConfig);

--UPDATE STATISTICS Config.Sistema WITH FULLSCAN;
--GO

--ALTER INDEX ALL ON Config.Sistema REBUILD;
--GO