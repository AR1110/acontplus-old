-- Declare the table name you want to find foreign keys for
DECLARE @TableName NVARCHAR(128) = 'SustentoTributario';

-- This query finds all foreign keys referencing the specified table
-- and generates DROP CONSTRAINT statements for them
SELECT 
    'ALTER TABLE [' + SCHEMA_NAME(fk.schema_id) + '].[' + OBJECT_NAME(fk.parent_object_id) + '] ' +
    'DROP CONSTRAINT [' + fk.name + '];' AS DropStatement
FROM 
    sys.foreign_keys AS fk
WHERE 
    OBJECT_NAME(fk.referenced_object_id) = @TableName;

-- To actually execute the drop statements automatically, you could use:
-- DECLARE @sql NVARCHAR(MAX);
-- 
-- SELECT @sql = STRING_AGG(
--     'ALTER TABLE [' + SCHEMA_NAME(fk.schema_id) + '].[' + OBJECT_NAME(fk.parent_object_id) + '] ' +
--     'DROP CONSTRAINT [' + fk.name + '];', CHAR(13) + CHAR(10))
-- FROM 
--     sys.foreign_keys AS fk
-- WHERE 
--     OBJECT_NAME(fk.referenced_object_id) = @TableName;
-- 
-- EXEC sp_executesql @sql;