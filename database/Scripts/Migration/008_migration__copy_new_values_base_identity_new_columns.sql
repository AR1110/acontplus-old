USE Acontplus
GO

SET NOCOUNT ON;

-- Tabla temporal para operaciones seguras
CREATE TABLE #SafeColumnCopyOperations (
    SchemaName NVARCHAR(128),
    TableName NVARCHAR(128),
    SourceColumn NVARCHAR(128),
    TargetColumn NVARCHAR(128),
    SourceDataType NVARCHAR(128),
    TargetDataType NVARCHAR(128),
    IsCompatible BIT,
    Operation NVARCHAR(100)
);

-- Buscar pares de columnas con compatibilidad de tipos
INSERT INTO #SafeColumnCopyOperations
SELECT 
    s.name AS SchemaName,
    t.name AS TableName,
    sc.name AS SourceColumn,
    tc.name AS TargetColumn,
    stype.name AS SourceDataType,
    ttype.name AS TargetDataType,
    CASE WHEN stype.system_type_id = ttype.system_type_id THEN 1 ELSE 0 END AS IsCompatible,
    sc.name + '->' + tc.name + 
        CASE WHEN sc.name = 'UserId' AND tc.name = 'CreatedByUserId' THEN ' (NULL=1)' ELSE '' END AS Operation
FROM sys.tables t
INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
-- Pares de columnas que buscamos
JOIN (VALUES ('Enabled','IsActive'),('Deleted','IsDeleted'),('UserId','CreatedByUserId')) AS cols(SourceCol, TargetCol)
    ON 1=1
-- Unión con columnas fuente
INNER JOIN sys.columns sc ON t.object_id = sc.object_id AND sc.name = cols.SourceCol
-- Unión con columnas destino
INNER JOIN sys.columns tc ON t.object_id = tc.object_id AND tc.name = cols.TargetCol
-- Tipos de datos
INNER JOIN sys.types stype ON sc.user_type_id = stype.user_type_id
INNER JOIN sys.types ttype ON tc.user_type_id = ttype.user_type_id
WHERE t.is_ms_shipped = 0;

-- Mostrar operaciones planeadas
SELECT * FROM #SafeColumnCopyOperations
ORDER BY IsCompatible DESC, SchemaName, TableName;

-- Ejecutar sólo operaciones compatibles
DECLARE @sql NVARCHAR(MAX);
DECLARE @schema NVARCHAR(128), @table NVARCHAR(128), @source NVARCHAR(128), @target NVARCHAR(128);

DECLARE copy_cursor CURSOR FOR
SELECT SchemaName, TableName, SourceColumn, TargetColumn 
FROM #SafeColumnCopyOperations
WHERE IsCompatible = 1;

OPEN copy_cursor;
FETCH NEXT FROM copy_cursor INTO @schema, @table, @source, @target;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Construir UPDATE según tipo de operación
    IF @source = 'UserId' AND @target = 'CreatedByUserId'
        SET @sql = 'UPDATE ' + QUOTENAME(@schema) + '.' + QUOTENAME(@table) + 
                   ' SET ' + QUOTENAME(@target) + ' = ISNULL(' + QUOTENAME(@source) + ', 1) ' +
                   'WHERE ' + QUOTENAME(@target) + ' IS NULL OR ' + QUOTENAME(@source) + ' IS NOT NULL;';
    ELSE
        SET @sql = 'UPDATE ' + QUOTENAME(@schema) + '.' + QUOTENAME(@table) + 
                   ' SET ' + QUOTENAME(@target) + ' = ' + QUOTENAME(@source) + ' ' +
                   'WHERE ' + QUOTENAME(@source) + ' IS NOT NULL;';
    
    PRINT 'Ejecutando: ' + @sql;
    
    BEGIN TRY
        EXEC sp_executesql @sql;
        PRINT '  OK: ' + CAST(@@ROWCOUNT AS VARCHAR) + ' filas afectadas';
    END TRY
    BEGIN CATCH
        PRINT '  ERROR: ' + ERROR_MESSAGE();
    END CATCH
    
    FETCH NEXT FROM copy_cursor INTO @schema, @table, @source, @target;
END

CLOSE copy_cursor;
DEALLOCATE copy_cursor;

-- Mostrar tablas no procesadas por incompatibilidad
IF EXISTS (SELECT 1 FROM #SafeColumnCopyOperations WHERE IsCompatible = 0)
BEGIN
    PRINT 'ADVERTENCIA: Estas tablas no se procesaron por incompatibilidad de tipos:';
    SELECT SchemaName, TableName, SourceColumn, TargetColumn, 
           SourceDataType, TargetDataType 
    FROM #SafeColumnCopyOperations 
    WHERE IsCompatible = 0;
END

DROP TABLE #SafeColumnCopyOperations;