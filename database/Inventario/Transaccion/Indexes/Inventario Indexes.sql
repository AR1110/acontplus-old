USE AcontPlus;  
GO

-- =============================================
-- Script para DROP y CREATE de índices
-- Verifica si existe el índice, lo elimina y lo vuelve a crear
-- =============================================

-- NUEVOS ÍNDICES BÁSICOS (Comentados - descomenta si los necesitas)
--IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Inventario_TransaccionDetalle')   
--    DROP INDEX IX_Inventario_TransaccionDetalle ON Inventario.TransaccionDetalle; 
--GO
--CREATE NONCLUSTERED INDEX IX_Inventario_TransaccionDetalle ON Inventario.TransaccionDetalle(idArticulo, idBodega, idMedida, idTarifa, estado)
--GO
--IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Inventario_Stock')   
--    DROP INDEX IX_Inventario_Stock ON Inventario.Stock; 
--GO
--CREATE NONCLUSTERED INDEX IX_Inventario_Stock ON Inventario.Stock(idArticulo, idBodega, consolidacionId, estado, consolidacion)
--GO

-- =============================================
-- ÍNDICES OPTIMIZADOS PARA SQL SERVER 2022+ ENTERPRISE
-- =============================================

-- Índice 1: TipoTransaccion
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Inventario.TipoTransaccion') AND name = 'IX_TipoTransaccion_codigo_optimized')
    DROP INDEX IX_TipoTransaccion_codigo_optimized ON Inventario.TipoTransaccion;
GO

CREATE NONCLUSTERED INDEX IX_TipoTransaccion_codigo_optimized 
ON Inventario.TipoTransaccion (codigo) 
INCLUDE (idTipoTransaccion)
WITH (OPTIMIZE_FOR_SEQUENTIAL_KEY = ON, DATA_COMPRESSION = PAGE);
GO

-- Índice 2: TipoDocumento
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Inventario.TipoDocumento') AND name = 'IX_TipoDocumento_codigo_optimized')
    DROP INDEX IX_TipoDocumento_codigo_optimized ON Inventario.TipoDocumento;
GO

CREATE NONCLUSTERED INDEX IX_TipoDocumento_codigo_optimized 
ON Inventario.TipoDocumento (codigo) 
INCLUDE (idTipoDocumento)
WITH (OPTIMIZE_FOR_SEQUENTIAL_KEY = ON, DATA_COMPRESSION = PAGE);
GO

-- Índice 3: Transaccion
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Inventario.Transaccion') AND name = 'IX_Transaccion_enterprise_lookup')
    DROP INDEX IX_Transaccion_enterprise_lookup ON Inventario.Transaccion;
GO

CREATE NONCLUSTERED INDEX IX_Transaccion_enterprise_lookup 
ON Inventario.Transaccion (idTipoDocumento, idDocumento, idTipoTransaccion) 
INCLUDE (idTransaccion, fechaEmision)
WITH (OPTIMIZE_FOR_SEQUENTIAL_KEY = ON, DATA_COMPRESSION = PAGE);
GO

-- Índice 4: TransaccionDetalle
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Inventario.TransaccionDetalle') AND name = 'IX_TransaccionDetalle_enterprise_perf')
    DROP INDEX IX_TransaccionDetalle_enterprise_perf ON Inventario.TransaccionDetalle;
GO

CREATE NONCLUSTERED INDEX IX_TransaccionDetalle_enterprise_perf 
ON Inventario.TransaccionDetalle (idArticulo, idBodega, estado, idTransaccion ) 
INCLUDE (cantidadTransaccion, ajusteId, saldo, idTransaccionDetalle)
WITH (OPTIMIZE_FOR_SEQUENTIAL_KEY = ON, DATA_COMPRESSION = PAGE);
GO

-- Índice 5: Stock
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Inventario.Stock') AND name = 'IX_Stock_enterprise_optimized')
    DROP INDEX IX_Stock_enterprise_optimized ON Inventario.Stock;
GO

CREATE NONCLUSTERED INDEX IX_Stock_enterprise_optimized 
ON Inventario.Stock (idArticulo, idBodega) 
INCLUDE (cantidad, idTransaccionDetalle)
WITH (OPTIMIZE_FOR_SEQUENTIAL_KEY = ON, DATA_COMPRESSION = PAGE);
GO

-- =============================================
-- VERIFICACIÓN DE ÍNDICES CREADOS
-- =============================================
--SELECT 
--    SCHEMA_NAME(t.schema_id) AS schema_name,
--    t.name AS table_name,
--    i.name AS index_name,
--    i.type_desc AS index_type,
--    i.is_unique,
--    i.data_space_id,
--    CASE WHEN i.data_compression > 0 THEN 'YES' ELSE 'NO' END AS compressed
--FROM sys.indexes i
--INNER JOIN sys.tables t ON i.object_id = t.object_id
--WHERE t.name IN ('TipoTransaccion', 'TipoDocumento', 'Transaccion', 'TransaccionDetalle', 'Stock')
--  AND SCHEMA_NAME(t.schema_id) = 'Inventario'
--  AND i.name LIKE '%optimized%' OR i.name LIKE '%enterprise%'
--ORDER BY schema_name, table_name, index_name;
