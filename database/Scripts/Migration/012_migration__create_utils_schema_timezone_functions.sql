USE Acontplus
GO

-- Create Utils schema if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Utils')
BEGIN
    EXEC('CREATE SCHEMA [Utils]');
    PRINT 'Schema [Utils] created successfully.';
END
ELSE
BEGIN
    PRINT 'Schema [Utils] already exists.';
END
GO

-- Drop existing functions if they exist (for updates)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Utils].[ConvertToEcuadorTime]') AND type = 'FN')
BEGIN
    DROP FUNCTION [Utils].[ConvertToEcuadorTime];
    PRINT 'Function Utils.ConvertToEcuadorTime dropped.';
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Utils].[ConvertToEcuadorTimeZone]') AND type = 'FN')
BEGIN
    DROP FUNCTION [Utils].[ConvertToEcuadorTimeZone];
    PRINT 'Function Utils.ConvertToEcuadorTimeZone dropped.';
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Utils].[GetEcuadorCurrentTime]') AND type = 'FN')
BEGIN
    DROP FUNCTION [Utils].[GetEcuadorCurrentTime];
    PRINT 'Function Utils.GetEcuadorCurrentTime dropped.';
END
GO

-- Create Function 1: Simple UTC-5 conversion
CREATE FUNCTION [Utils].[ConvertToEcuadorTime](@UtcDateTime DATETIME2)
RETURNS DATETIME2
AS
BEGIN
    -- Ecuador is UTC-5 (no daylight saving time)
    RETURN DATEADD(HOUR, -5, @UtcDateTime)
END
GO

-- Create Function 2: Using AT TIME ZONE (for SQL Server 2016+)
CREATE FUNCTION [Utils].[ConvertToEcuadorTimeZone](@UtcDateTime DATETIME2)
RETURNS DATETIMEOFFSET
AS
BEGIN
    -- Convert UTC to Ecuador using official time zones
    -- Note: Returns DATETIMEOFFSET to preserve timezone information
    DECLARE @result DATETIMEOFFSET
    SET @result = @UtcDateTime AT TIME ZONE 'UTC' AT TIME ZONE 'SA Pacific Standard Time'
    RETURN @result
END
GO

-- Create Function 3: Get current Ecuador time
CREATE FUNCTION [Utils].[GetEcuadorCurrentTime]()
RETURNS DATETIME2
AS
BEGIN
    RETURN DATEADD(HOUR, -5, GETUTCDATE())
END
GO

-- Alternative Function 3 using AT TIME ZONE (for SQL Server 2016+)
CREATE FUNCTION [Utils].[GetEcuadorCurrentTimeZone]()
RETURNS DATETIMEOFFSET
AS
BEGIN
    RETURN GETUTCDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SA Pacific Standard Time'
END
GO

-- Verification: Test the functions
PRINT 'Testing functions:';
SELECT 
    GETUTCDATE() AS UTC_Time,
    [Utils].[ConvertToEcuadorTime](GETUTCDATE()) AS Ecuador_Time_Simple,
    [Utils].[GetEcuadorCurrentTime]() AS Current_Ecuador_Time_Simple;

-- Test timezone functions if SQL Server 2016+ is available
BEGIN TRY
    SELECT 
        [Utils].[ConvertToEcuadorTimeZone](GETUTCDATE()) AS Ecuador_Time_TimeZone,
        [Utils].[GetEcuadorCurrentTimeZone]() AS Current_Ecuador_Time_TimeZone;
    PRINT 'Timezone functions are working (SQL Server 2016+)';
END TRY
BEGIN CATCH
    PRINT 'Timezone functions not available (requires SQL Server 2016+)';
END CATCH

PRINT 'All functions created successfully in [Utils] schema.';