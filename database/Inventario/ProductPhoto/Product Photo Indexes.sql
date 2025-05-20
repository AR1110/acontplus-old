USE Acontplus
GO

--IF EXISTS (SELECT name FROM sys.indexes  
--            WHERE name = N'idx_Inventario_ProductPhoto')   
--    DROP INDEX idx_Inventario_ProductPhoto ON Inventario.ProductPhoto;  
--GO

--CREATE NONCLUSTERED INDEX idx_Inventario_ProductPhoto
--ON Inventario.ProductPhoto (ProductId, IsDefault)


--UPDATE STATISTICS Inventario.ProductPhoto WITH FULLSCAN;
--GO

--ALTER INDEX ALL ON Inventario.ProductPhoto REBUILD;
--GO
