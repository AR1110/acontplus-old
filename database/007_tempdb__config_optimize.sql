SET NOCOUNT ON;
GO

-- Configuration parameters (modify these as needed)
DECLARE @RecommendedDataSizeMB INT = 4096;  -- 4GB
DECLARE @RecommendedLogSizeMB INT = 1024;   -- 1GB
DECLARE @RecommendedDataGrowthMB INT = 1024;-- 1GB
DECLARE @RecommendedLogGrowthMB INT = 256;  -- 256MB
DECLARE @ExecuteChanges BIT = 0;            -- Set to 1 to actually make changes

-- Create temp table to store current configuration for rollback
CREATE TABLE #TempDBConfigBackup (
    FileName NVARCHAR(128),
    FileType NVARCHAR(60),
    CurrentSizeMB INT,
    CurrentGrowthMB INT,
    IsPercentGrowth BIT,
    MaxSizeMB INT
);

-- Store current config
INSERT INTO #TempDBConfigBackup
SELECT 
    name,
    type_desc,
    size * 8 / 1024,
    growth * 8 / 1024,
    is_percent_growth,
    CASE WHEN max_size = -1 THEN -1 ELSE max_size * 8 / 1024 END
FROM tempdb.sys.database_files;

-- Display current configuration
PRINT '--- CURRENT TEMPDB CONFIGURATION ---';
SELECT 
    FileName,
    FileType,
    CurrentSizeMB AS [Size (MB)],
    CurrentGrowthMB AS [Growth (MB)],
    CASE IsPercentGrowth WHEN 1 THEN 'YES' ELSE 'NO' END AS [PercentGrowth],
    CASE MaxSizeMB WHEN -1 THEN 'UNLIMITED' ELSE CAST(MaxSizeMB AS VARCHAR) + ' MB' END AS [MaxSize]
FROM #TempDBConfigBackup
ORDER BY FileType DESC;

-- Generate and execute ALTER statements only where needed
PRINT '--- RECOMMENDED CHANGES ---';
DECLARE @SQL NVARCHAR(MAX) = '';
DECLARE @RollbackSQL NVARCHAR(MAX) = 'PRINT ''--- ROLLBACK SCRIPT ---'';' + CHAR(13) + CHAR(10);

SELECT @SQL = @SQL + 
    CASE 
        WHEN FileType = 'ROWS' AND 
             (CurrentSizeMB < @RecommendedDataSizeMB OR IsPercentGrowth = 1 OR CurrentGrowthMB <> @RecommendedDataGrowthMB)
        THEN 'ALTER DATABASE tempdb MODIFY FILE (NAME = ' + FileName + ', SIZE = ' + 
             CAST(@RecommendedDataSizeMB AS NVARCHAR) + 'MB, FILEGROWTH = ' + 
             CAST(@RecommendedDataGrowthMB AS NVARCHAR) + 'MB);' + CHAR(13) + CHAR(10)
             
        WHEN FileType = 'LOG' AND 
             (CurrentSizeMB < @RecommendedLogSizeMB OR IsPercentGrowth = 1 OR CurrentGrowthMB <> @RecommendedLogGrowthMB)
        THEN 'ALTER DATABASE tempdb MODIFY FILE (NAME = ' + FileName + ', SIZE = ' + 
             CAST(@RecommendedLogSizeMB AS NVARCHAR) + 'MB, FILEGROWTH = ' + 
             CAST(@RecommendedLogGrowthMB AS NVARCHAR) + 'MB);' + CHAR(13) + CHAR(10)
        ELSE ''
    END,
    
    @RollbackSQL = @RollbackSQL +
    'ALTER DATABASE tempdb MODIFY FILE (NAME = ' + FileName + ', SIZE = ' + 
    CAST(CurrentSizeMB AS NVARCHAR) + 'MB, FILEGROWTH = ' + 
    CAST(CurrentGrowthMB AS NVARCHAR) + 'MB' +
    CASE WHEN IsPercentGrowth = 1 THEN ', IS_PERCENT_GROWTH = ON' ELSE '' END + ');' + CHAR(13) + CHAR(10)
FROM #TempDBConfigBackup;

-- Display what would be changed
PRINT '-- These changes will be made: --';
PRINT @SQL;

-- Display rollback script
PRINT '-- Rollback script: --';
PRINT @RollbackSQL;

-- Execute changes if requested
IF @ExecuteChanges = 1 AND LEN(@SQL) > 0
BEGIN
    PRINT '-- Executing changes... --';
    EXEC sp_executesql @SQL;
    PRINT '-- Changes completed. New configuration: --';
    
    SELECT 
        name AS [FileName],
        type_desc AS [FileType],
        size * 8 / 1024 AS [SizeMB],
        growth * 8 / 1024 AS [GrowthMB],
        CASE is_percent_growth WHEN 1 THEN 'YES' ELSE 'NO' END AS [PercentGrowth],
        CASE WHEN max_size = -1 THEN 'UNLIMITED' ELSE CAST(max_size * 8 / 1024 AS VARCHAR) + ' MB' END AS [MaxSize]
    FROM tempdb.sys.database_files
    ORDER BY type_desc DESC;
END
ELSE IF @ExecuteChanges = 1
BEGIN
    PRINT '-- No changes needed - TempDB already properly configured --';
END
ELSE
BEGIN
    PRINT '-- Changes NOT executed (set @ExecuteChanges = 1 to apply) --';
END

-- Clean up
DROP TABLE #TempDBConfigBackup;
GO