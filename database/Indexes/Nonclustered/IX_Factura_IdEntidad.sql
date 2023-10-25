USE AcontPlus;  
GO  
-- Find an existing index named IX_Articulo_IdEntidad and delete it if found.   
IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'IX_Factura_IdCliente')   
    DROP INDEX IX_Factura_IdCliente ON Factura;  
GO  
-- Create a nonclustered index called IX_CH_IdProveedor   
-- on the dbo.Articulo table using the BusinessEntityID column.   
CREATE NONCLUSTERED INDEX IX_Factura_IdCliente
    ON Factura(idCliente);   
GO 