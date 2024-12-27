USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-11-08
-- Description:	sp for get all records of tables
-- =============================================
CREATE OR ALTER PROCEDURE Common.DB_Records_Get
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   DECLARE @sql NVARCHAR(MAX);

	-- Build the dynamic SQL using FOR XML PATH to avoid 8000 character limit
	SELECT @sql = (
		SELECT 'SELECT ''' + s.name + '.' + t.name + ''' AS TableName, COUNT(*) AS [RowCount] FROM ' 
			   + QUOTENAME(s.name) + '.' + QUOTENAME(t.name) + ' UNION ALL '
		FROM sys.tables t
		JOIN sys.schemas s ON t.schema_id = s.schema_id
		WHERE t.type = 'U' -- Only user tables
		FOR XML PATH(''), TYPE
	).value('.', 'NVARCHAR(MAX)');

	-- Remove the trailing ' UNION ALL '
	SET @sql = LEFT(@sql, LEN(@sql) - LEN(' UNION ALL '));

	-- Execute the dynamic SQL
	EXEC sp_executesql @sql;

END
GO
