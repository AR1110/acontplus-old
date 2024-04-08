use acontplus
go



DECLARE @dbSchema NVARCHAR(200);
SET @dbSchema = 'TechnicalSupport'  -- CHANGE TO YOUR SCHEMA


DECLARE @SqlStatement NVARCHAR(MAX)
SELECT @SqlStatement =
    COALESCE(@SqlStatement, N'') + N'DROP TABLE ' +'[' + @dbSchema +']' + '.' + QUOTENAME(TABLE_NAME) + N';' + CHAR(13)
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = @dbSchema and TABLE_TYPE = 'BASE TABLE'


EXEC sp_executesql @SqlStatement