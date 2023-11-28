USE AcontPlus;  
GO

--ELIMINAR
IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_TipoTranId')   
    DROP INDEX IX_IT_TipoTranId ON Inventario.Transaccion;  
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_ArticuloId')   
    DROP INDEX IX_IT_ArticuloId ON Inventario.Transaccion;  
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_BodegaId')   
    DROP INDEX IX_IT_BodegaId ON Inventario.Transaccion;  
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_TipoDocumentoId')   
    DROP INDEX IX_IT_TipoDocumentoId ON Inventario.Transaccion;  
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_MedidaId')   
    DROP INDEX IX_IT_MedidaId ON Inventario.Transaccion;  
GO

IF EXISTS (SELECT name
FROM sys.indexes
WHERE name = N'IX_IT_TarifaId')   
    DROP INDEX IX_IT_TarifaId ON Inventario.Transaccion;  
GO

--NUEVOS
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Inventario_Transaccion')   
    DROP INDEX IX_Inventario_Transaccion ON Inventario.Transaccion; 
GO
CREATE NONCLUSTERED INDEX IX_Inventario_Transaccion ON Inventario.Transaccion(idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idMedida, idTarifa, estado)
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Inventario_Stock')   
    DROP INDEX IX_Inventario_Stock ON Inventario.Stock; 
GO
CREATE NONCLUSTERED INDEX IX_Inventario_Stock ON Inventario.Stock(idArticulo, idBodega, consolidacionId, estado, consolidacion)
GO
