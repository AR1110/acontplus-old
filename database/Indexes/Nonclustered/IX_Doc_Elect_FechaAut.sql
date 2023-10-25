USE AcontPlus;  
GO  
-- Find an existing index named IX_Articulo_IdEntidad and delete it if found.   
IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Doc_Elect_FechaAut')   
    DROP INDEX IX_Doc_Elect_FechaAut ON DocumentoElectronico;  
GO  
-- Create a nonclustered index called IX_CH_IdProveedor   
-- on the dbo.Articulo table using the BusinessEntityID column.   
CREATE NONCLUSTERED INDEX IX_Doc_Elect_FechaAut
    ON DocumentoElectronico(fechaAutorizacion);   
GO 