USE Acontplus
GO
-- =====================================================
-- MANTENIMIENTO NOCTURNO COMPLETO - 11:00 PM
-- SQL Server 2022 Enterprise - Optimización máxima
-- =====================================================

SET NOCOUNT ON;
DECLARE @StartTime DATETIME = GETDATE();
DECLARE @ProcessedTables INT = 0;
DECLARE @RebuiltIndexes INT = 0;
DECLARE @ReorganizedIndexes INT = 0;
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
DECLARE @indextype TINYINT;

-- Log inicio con información del sistema
PRINT '=== MANTENIMIENTO NOCTURNO INICIADO: ' + CONVERT(VARCHAR, @StartTime, 120) + ' ===';
PRINT 'Servidor: ' + @@SERVERNAME;
PRINT 'Base de datos: ' + DB_NAME();
PRINT 'Versión SQL: ' + @@VERSION;
PRINT '';

-- Verificar espacio disponible antes de iniciar
PRINT 'Verificando espacio disponible...';
SELECT 
    name AS FileName,
    ROUND(size/128.0, 2) AS SizeMB,
    ROUND(FILEPROPERTY(name, 'SpaceUsed')/128.0, 2) AS UsedMB,
    ROUND((size - FILEPROPERTY(name, 'SpaceUsed'))/128.0, 2) AS FreeMB,
    ROUND(((size - FILEPROPERTY(name, 'SpaceUsed')) * 100.0 / size), 2) AS FreePercent
FROM sys.database_files
WHERE type_desc IN ('ROWS', 'LOG');
PRINT '';

-- Backup del log antes del mantenimiento (recomendado)
PRINT 'Realizando checkpoint...';
CHECKPOINT;

-- Cursor optimizado para mantenimiento nocturno completo
DECLARE curIndexesNight CURSOR LOCAL FAST_FORWARD FOR
SELECT 
    ps.object_id,
    ps.index_id,
    ps.partition_number,
    ps.avg_fragmentation_in_percent,
    ps.page_count,
    ps.record_count,
    ix.type AS index_type
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'DETAILED') ps  -- DETAILED para análisis completo
INNER JOIN sys.indexes ix ON ps.object_id = ix.object_id AND ps.index_id = ix.index_id
INNER JOIN sys.objects obj ON ps.object_id = obj.object_id
WHERE 
    ps.avg_fragmentation_in_percent >= 5.0   -- Umbral más bajo para mantenimiento nocturno
    AND ps.page_count > 25                   -- Índices con más de 25 páginas
    AND ix.is_disabled = 0
    AND obj.type = 'U'
    AND ps.alloc_unit_type_desc = 'IN_ROW_DATA'
    AND obj.name NOT LIKE 'sys%'            -- Excluir tablas del sistema
ORDER BY 
    ps.avg_fragmentation_in_percent DESC, ps.page_count DESC;

OPEN curIndexesNight;
FETCH NEXT FROM curIndexesNight INTO @objectid, @indexid, @partitionnum, @frag, @pagecount, @recordcount, @indextype;

WHILE (@@FETCH_STATUS = 0)
BEGIN
    BEGIN TRY
        SELECT 
            @schemaname = OBJECT_SCHEMA_NAME(@objectid),
            @objectname = OBJECT_NAME(@objectid),
            @indexname = ISNULL(ix.name, 'HEAP')
        FROM sys.indexes ix
        WHERE ix.object_id = @objectid AND ix.index_id = @indexid;

        -- POLÍTICA AGRESIVA PARA MANTENIMIENTO NOCTURNO
        IF @frag >= 30.0 OR (@frag >= 15.0 AND @pagecount > 1000)
        BEGIN
            -- REBUILD con configuración optimizada
            IF @indextype = 1  -- Clustered index
            BEGIN
                SET @sql = 'ALTER INDEX [' + @indexname + '] ON [' + @schemaname + '].[' + @objectname + '] REBUILD WITH (
                    ONLINE = ON,
                    SORT_IN_TEMPDB = ON,
                    MAXDOP = 0,
                    FILLFACTOR = 90,
                    PAD_INDEX = ON,
                    STATISTICS_NORECOMPUTE = OFF,
                    ALLOW_ROW_LOCKS = ON,
                    ALLOW_PAGE_LOCKS = ON
                )';
            END
            ELSE  -- Non-clustered index
            BEGIN
                SET @sql = 'ALTER INDEX [' + @indexname + '] ON [' + @schemaname + '].[' + @objectname + '] REBUILD WITH (
                    ONLINE = ON,
                    SORT_IN_TEMPDB = ON,
                    MAXDOP = 0,
                    FILLFACTOR = 95,
                    PAD_INDEX = ON,
                    STATISTICS_NORECOMPUTE = OFF
                )';
            END
            
            PRINT 'REBUILD: ' + @schemaname + '.' + @objectname + '.' + @indexname + 
                  ' (Frag: ' + CAST(ROUND(@frag,1) AS VARCHAR) + '%, Páginas: ' + CAST(@pagecount AS VARCHAR) + 
                  ', Tipo: ' + CASE @indextype WHEN 1 THEN 'CLUSTERED' ELSE 'NONCLUSTERED' END + ')';
            
            EXEC sp_executesql @sql;
            SET @RebuiltIndexes = @RebuiltIndexes + 1;
        END
        ELSE IF @frag >= 10.0 OR (@frag >= 5.0 AND @pagecount > 500)
        BEGIN
            -- REORGANIZE para fragmentación media
            SET @sql = 'ALTER INDEX [' + @indexname + '] ON [' + @schemaname + '].[' + @objectname + '] REORGANIZE';
            
            PRINT 'REORGANIZE: ' + @schemaname + '.' + @objectname + '.' + @indexname + 
                  ' (Frag: ' + CAST(ROUND(@frag,1) AS VARCHAR) + '%, Páginas: ' + CAST(@pagecount AS VARCHAR) + ')';
            
            EXEC sp_executesql @sql;
            SET @ReorganizedIndexes = @ReorganizedIndexes + 1;
        END
        ELSE
        BEGIN
            SET @SkippedIndexes = @SkippedIndexes + 1;
        END

        -- Progreso cada 25 índices
        IF (@RebuiltIndexes + @ReorganizedIndexes) % 25 = 0
        BEGIN
            DECLARE @ElapsedMinutes INT = DATEDIFF(MINUTE, @StartTime, GETDATE());
            PRINT 'PROGRESO: ' + CAST(@RebuiltIndexes AS VARCHAR) + ' rebuilds, ' + 
                  CAST(@ReorganizedIndexes AS VARCHAR) + ' reorganizes en ' + 
                  CAST(@ElapsedMinutes AS VARCHAR) + ' minutos';
        END

    END TRY
    BEGIN CATCH
        PRINT 'ERROR en ' + @schemaname + '.' + @objectname + '.' + @indexname + ': ' + ERROR_MESSAGE();
        
        -- Si falla ONLINE, intentar OFFLINE como fallback
        IF ERROR_NUMBER() = 2725 OR ERROR_NUMBER() = 1505  -- Errores comunes de ONLINE rebuild
        BEGIN
            BEGIN TRY
                SET @sql = REPLACE(@sql, 'ONLINE = ON,', '');
                PRINT 'REINTENTANDO SIN ONLINE: ' + @indexname;
                EXEC sp_executesql @sql;
                SET @RebuiltIndexes = @RebuiltIndexes + 1;
            END TRY
            BEGIN CATCH
                PRINT 'ERROR PERSISTENTE en ' + @indexname + ': ' + ERROR_MESSAGE();
            END CATCH
        END
    END CATCH

    FETCH NEXT FROM curIndexesNight INTO @objectid, @indexid, @partitionnum, @frag, @pagecount, @recordcount, @indextype;
END

CLOSE curIndexesNight;
DEALLOCATE curIndexesNight;

PRINT '';
PRINT 'Actualizando estadísticas de toda la base de datos...';

-- Actualizar estadísticas con FULLSCAN para máxima precisión
DECLARE curStats CURSOR LOCAL FAST_FORWARD FOR
SELECT DISTINCT 
    OBJECT_SCHEMA_NAME(object_id) + '.' + OBJECT_NAME(object_id) AS TableName
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED')
WHERE avg_fragmentation_in_percent IS NOT NULL;

DECLARE @TableName NVARCHAR(256);
OPEN curStats;
FETCH NEXT FROM curStats INTO @TableName;

WHILE (@@FETCH_STATUS = 0)
BEGIN
    BEGIN TRY
        SET @sql = 'UPDATE STATISTICS ' + @TableName + ' WITH FULLSCAN';
        EXEC sp_executesql @sql;
        PRINT 'Estadísticas actualizadas: ' + @TableName;
    END TRY
    BEGIN CATCH
        PRINT 'ERROR actualizando estadísticas de ' + @TableName + ': ' + ERROR_MESSAGE();
    END CATCH
    
    FETCH NEXT FROM curStats INTO @TableName;
END

CLOSE curStats;
DEALLOCATE curStats;

-- Limpiar buffer pool para estadísticas frescas (opcional)
-- DBCC FREEPROCCACHE;  -- Descomenta si quieres limpiar planes de ejecución

-- Verificación final de fragmentación
PRINT '';
PRINT 'Verificando fragmentación post-mantenimiento...';
SELECT TOP 10
    OBJECT_SCHEMA_NAME(ps.object_id) AS SchemaName,
    OBJECT_NAME(ps.object_id) AS TableName,
    ix.name AS IndexName,
    ROUND(ps.avg_fragmentation_in_percent, 2) AS FragmentationPercent,
    ps.page_count AS PageCount
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps
INNER JOIN sys.indexes ix ON ps.object_id = ix.object_id AND ps.index_id = ix.index_id
WHERE ps.avg_fragmentation_in_percent > 10
ORDER BY ps.avg_fragmentation_in_percent DESC;

-- Resumen final completo
DECLARE @EndTime DATETIME = GETDATE();
DECLARE @Duration INT = DATEDIFF(MINUTE, @StartTime, @EndTime);

PRINT '';
PRINT '=== MANTENIMIENTO NOCTURNO COMPLETADO ===';
PRINT 'Inicio: ' + CONVERT(VARCHAR, @StartTime, 120);
PRINT 'Fin: ' + CONVERT(VARCHAR, @EndTime, 120);
PRINT 'Duración total: ' + CAST(@Duration AS VARCHAR) + ' minutos';
PRINT 'Índices reconstruidos (REBUILD): ' + CAST(@RebuiltIndexes AS VARCHAR);
PRINT 'Índices reorganizados (REORGANIZE): ' + CAST(@ReorganizedIndexes AS VARCHAR);
PRINT 'Índices omitidos: ' + CAST(@SkippedIndexes AS VARCHAR);
PRINT 'Total procesado: ' + CAST(@RebuiltIndexes + @ReorganizedIndexes AS VARCHAR);
PRINT '';
PRINT 'Base de datos optimizada. Monitorear rendimiento durante las próximas horas.';

-- Checkpoint final
CHECKPOINT;