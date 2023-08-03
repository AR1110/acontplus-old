USE AcontPlus;  
GO
IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_TipoTranId')   
    DROP INDEX IX_IT_TipoTranId ON Inventario.Transaccion;  
GO
CREATE NONCLUSTERED INDEX IX_IT_TipoTranId
    ON Inventario.Transaccion(idTipoTransaccion);   
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_ArticuloId')   
    DROP INDEX IX_IT_ArticuloId ON Inventario.Transaccion;  
GO
CREATE NONCLUSTERED INDEX IX_IT_ArticuloId
    ON Inventario.Transaccion(idArticulo);   
GO


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_BodegaId')   
    DROP INDEX IX_IT_BodegaId ON Inventario.Transaccion;  
GO
CREATE NONCLUSTERED INDEX IX_IT_BodegaId
    ON Inventario.Transaccion(idBodega);   
GO


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_TipoDocumentoId')   
    DROP INDEX IX_IT_TipoDocumentoId ON Inventario.Transaccion;  
GO
CREATE NONCLUSTERED INDEX IX_IT_TipoDocumentoId
    ON Inventario.Transaccion(idTipoDocumento);   
GO


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_MedidaId')   
    DROP INDEX IX_IT_MedidaId ON Inventario.Transaccion;  
GO
CREATE NONCLUSTERED INDEX IX_IT_MedidaId
    ON Inventario.Transaccion(idMedida);   
GO


IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_TarifaId')   
    DROP INDEX IX_IT_TarifaId ON Inventario.Transaccion;  
GO
CREATE NONCLUSTERED INDEX IX_IT_TarifaId
    ON Inventario.Transaccion(idTarifa);   
GO 
