USE AcontPlus;  
GO

--NUEVOS
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Inventario_TransaccionDetalle')   
    DROP INDEX IX_Inventario_TransaccionDetalle ON Inventario.TransaccionDetalle; 
GO
CREATE NONCLUSTERED INDEX IX_Inventario_TransaccionDetalle ON Inventario.TransaccionDetalle(idArticulo, idBodega, idMedida, idTarifa, estado)
GO

IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Inventario_Stock')   
    DROP INDEX IX_Inventario_Stock ON Inventario.Stock; 
GO
CREATE NONCLUSTERED INDEX IX_Inventario_Stock ON Inventario.Stock(idArticulo, idBodega, consolidacionId)
INCLUDE(estado, consolidacion, cantidad)
GO
