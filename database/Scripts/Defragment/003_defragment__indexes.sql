USE Acontplus; -- Replace with your database name
GO

--SELECT 
--    dbschemas.[name] AS 'Schema',
--    dbtables.[name] AS 'Table',
--    dbindexes.[name] AS 'Index',
--    indexstats.avg_fragmentation_in_percent,
--    indexstats.page_count
--FROM 
--    sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'SAMPLED') AS indexstats
--INNER JOIN 
--    sys.tables dbtables ON indexstats.object_id = dbtables.object_id
--INNER JOIN 
--    sys.schemas dbschemas ON dbtables.schema_id = dbschemas.schema_id
--INNER JOIN 
--    sys.indexes AS dbindexes ON dbtables.object_id = dbindexes.object_id
--                                 AND indexstats.index_id = dbindexes.index_id
--WHERE 
--    indexstats.database_id = DB_ID()
--ORDER BY 
--    indexstats.avg_fragmentation_in_percent DESC;


--ALTER INDEX [IndexName] ON [SchemaName].[TableName]
--REORGANIZE;


--ALTER INDEX [IndexName] ON [SchemaName].[TableName]
--REBUILD;


DECLARE @objectid INT;
DECLARE @indexid INT;
DECLARE @partitioncount BIGINT;
DECLARE @schemaname NVARCHAR(130);
DECLARE @objectname NVARCHAR(130);
DECLARE @indexname NVARCHAR(130);
DECLARE @partitionnum BIGINT;
DECLARE @partitions BIGINT;
DECLARE @frag FLOAT;

DECLARE @tablename NVARCHAR(130);

-- Cursor to iterate through all the indexes
DECLARE curIndexes CURSOR FOR
SELECT 
    object_id,
    index_id,
    partition_number,
    avg_fragmentation_in_percent
FROM 
    sys.dm_db_index_physical_stats (DB_ID(), NULL, NULL , NULL, 'SAMPLED')
WHERE 
    avg_fragmentation_in_percent > 10.0 -- Change the threshold value as needed
ORDER BY 
    avg_fragmentation_in_percent DESC;

OPEN curIndexes;

FETCH NEXT FROM curIndexes INTO @objectid, @indexid, @partitionnum, @frag;

WHILE (@@FETCH_STATUS = 0)
BEGIN
    SELECT 
        @schemaname = OBJECT_SCHEMA_NAME(@objectid),
        @objectname = OBJECT_NAME(@objectid),
        @indexname = ix.name
    FROM 
        sys.indexes ix
    WHERE 
        ix.object_id = @objectid AND ix.index_id = @indexid;

    -- Rebuild indexes with fragmentation > 30%
    IF @frag >= 30.0
    BEGIN
        PRINT 'Rebuilding index ' + @indexname + ' on table ' + @schemaname + '.' + @objectname + ' with fragmentation ' + CAST(@frag AS VARCHAR(15));
        EXEC ('ALTER INDEX [' + @indexname + '] ON [' + @schemaname + '].[' + @objectname + '] REBUILD');
    END
    -- Reorganize indexes with fragmentation between 10% and 30%
    ELSE IF @frag >= 10.0
    BEGIN
        PRINT 'Reorganizing index ' + @indexname + ' on table ' + @schemaname + '.' + @objectname + ' with fragmentation ' + CAST(@frag AS VARCHAR(15));
        EXEC ('ALTER INDEX [' + @indexname + '] ON [' + @schemaname + '].[' + @objectname + '] REORGANIZE');
    END

    FETCH NEXT FROM curIndexes INTO @objectid, @indexid, @partitionnum, @frag;
END

CLOSE curIndexes;
DEALLOCATE curIndexes;
