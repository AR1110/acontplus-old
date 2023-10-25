USE AcontPlus;  
GO  
-- Find an existing index named IX_Articulo_IdEntidad and delete it if found.   
IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Articulo_IdEntidad')   
    DROP INDEX IX_Articulo_IdEntidad ON dbo.Articulo;   
GO  
-- Create a nonclustered index called IX_Articulo_IdEntidad   
-- on the dbo.Articulo table using the BusinessEntityID column.   
CREATE NONCLUSTERED INDEX IX_Articulo_IdEntidad
    ON dbo.Articulo(idEntidad);   
GO 