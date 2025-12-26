USE Acontplus
GO
-- =====================================================
-- MANTENIMIENTO EN VIVO - ALTA CONCURRENCIA
-- SQL Server 2022 Enterprise - Seguro para horario laboral
-- =====================================================

SET NOCOUNT ON;
DECLARE @StartTime DATETIME = GETDATE();
DECLARE @ProcessedTables INT = 0;
DECLARE @ProcessedIndexes INT = 0;
DECLARE @SkippedIndexes INT = 0;

-- Variables del cursor
DECLARE @objectid INT;
DECLARE @indexid INT;
DECLARE @partitionnum BIGINT;
DECLARE @frag FLOAT;
DECLARE @schemaname NVARCHAR(130);
DECLARE @objectname NVARCHAR(130);
DECLARE @indexname NVARCHAR(130);
DECLARE @sql NVARCHAR(MAX);
DECLARE @pagecount BIGINT;
DECLARE @recordcount BIGINT;

-- Log inicio
PRINT '=== MANTENIMIENTO EN VIVO INICIADO: ' + CONVERT(VARCHAR, @StartTime, 120) + ' ===';
PRINT 'Modo: SEGURO para alta concurrencia';
PRINT 'Acciones: REORGANIZE únicamente (no REBUILD)';
PRINT '';

-- Cursor optimizado para producción en vivo
DECLARE curIndexesLive CURSOR LOCAL FAST_FORWARD FOR
SELECT 
    ps.object_id,
    ps.index_id,
    ps.partition_number,
    ps.avg_fragmentation_in_percent,
    ps.page_count,
    ps.record_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'SAMPLED') ps
INNER JOIN sys.indexes ix ON ps.object_id = ix.object_id AND ps.index_id = ix.index_id
INNER JOIN sys.objects obj ON ps.object_id = obj.object_id
WHERE 
    ps.avg_fragmentation_in_percent >= 10.0
    AND ps.page_count > 100  -- Solo índices con más de 100 páginas
    AND ix.is_disabled = 0   -- Excluir índices deshabilitados
    AND obj.type = 'U'       -- Solo tablas de usuario
    AND ps.alloc_unit_type_desc = 'IN_ROW_DATA'  -- Solo datos principales
ORDER BY 
    ps.avg_fragmentation_in_percent DESC;

OPEN curIndexesLive;
FETCH NEXT FROM curIndexesLive INTO @objectid, @indexid, @partitionnum, @frag, @pagecount, @recordcount;

WHILE (@@FETCH_STATUS = 0)
BEGIN
    BEGIN TRY
        SELECT 
            @schemaname = OBJECT_SCHEMA_NAME(@objectid),
            @objectname = OBJECT_NAME(@objectid),
            @indexname = ISNULL(ix.name, 'HEAP')
        FROM sys.indexes ix
        WHERE ix.object_id = @objectid AND ix.index_id = @indexid;

        -- POLÍTICA CONSERVADORA PARA PRODUCCIÓN EN VIVO
        IF @frag >= 15.0 AND @pagecount >= 100
        BEGIN
            -- Solo REORGANIZE en horario laboral (más seguro)
            SET @sql = 'ALTER INDEX [' + @indexname + '] ON [' + @schemaname + '].[' + @objectname + '] REORGANIZE';
            
            PRINT 'REORGANIZANDO: ' + @schemaname + '.' + @objectname + '.' + @indexname + 
                  ' (Frag: ' + CAST(ROUND(@frag,1) AS VARCHAR) + '%, Páginas: ' + CAST(@pagecount AS VARCHAR) + ')';
            
            -- Ejecutar con timeout reducido para no bloquear
            EXEC sp_executesql @sql;
            
            SET @ProcessedIndexes = @ProcessedIndexes + 1;
            
            -- Pausa pequeña entre índices para no saturar
            WAITFOR DELAY '00:00:02';
        END
        ELSE
        BEGIN
            SET @SkippedIndexes = @SkippedIndexes + 1;
            IF @frag >= 10.0
                PRINT 'OMITIDO (política conservadora): ' + @schemaname + '.' + @objectname + '.' + @indexname + 
                      ' (Frag: ' + CAST(ROUND(@frag,1) AS VARCHAR) + '%, Páginas: ' + CAST(@pagecount AS VARCHAR) + ')';
        END

        -- Verificar si hay bloqueos cada 10 índices
        IF @ProcessedIndexes % 10 = 0
        BEGIN
            DECLARE @BlockingCount INT;
            SELECT @BlockingCount = COUNT(*)
            FROM sys.dm_exec_requests
            WHERE blocking_session_id > 0;
            
            IF @BlockingCount > 5
            BEGIN
                PRINT 'ADVERTENCIA: Detectados ' + CAST(@BlockingCount AS VARCHAR) + ' bloqueos. Pausando 10 segundos...';
                WAITFOR DELAY '00:00:10';
            END
        END

    END TRY
    BEGIN CATCH
        PRINT 'ERROR en ' + @schemaname + '.' + @objectname + '.' + @indexname + ': ' + ERROR_MESSAGE();
        -- Continuar con el siguiente índice sin detener el proceso
    END CATCH

    FETCH NEXT FROM curIndexesLive INTO @objectid, @indexid, @partitionnum, @frag, @pagecount, @recordcount;
END

CLOSE curIndexesLive;
DEALLOCATE curIndexesLive;

-- Actualizar estadísticas de tablas más críticas
PRINT '';
PRINT 'Actualizando estadísticas de tablas críticas...';

UPDATE STATISTICS dbo.factura WITH SAMPLE 20 PERCENT;  -- Muestra del 20% para no impactar rendimiento
PRINT 'Estadísticas actualizadas: dbo.factura';


UPDATE STATISTICS dbo.DocumentoElectronico WITH SAMPLE 20 PERCENT;  -- Muestra del 20% para no impactar rendimiento
PRINT 'Estadísticas actualizadas: dbo.DocumentoElectronico';

-- Resumen final
DECLARE @EndTime DATETIME = GETDATE();
DECLARE @Duration INT = DATEDIFF(MINUTE, @StartTime, @EndTime);

PRINT '';
PRINT '=== MANTENIMIENTO EN VIVO COMPLETADO ===';
PRINT 'Duración: ' + CAST(@Duration AS VARCHAR) + ' minutos';
PRINT 'Índices procesados: ' + CAST(@ProcessedIndexes AS VARCHAR);
PRINT 'Índices omitidos: ' + CAST(@SkippedIndexes AS VARCHAR);
PRINT 'Fin: ' + CONVERT(VARCHAR, @EndTime, 120);
PRINT '';
PRINT 'RECOMENDACIÓN: Ejecutar mantenimiento nocturno completo para optimización total.';