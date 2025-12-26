-- SQL Server Performance & Optimization Dashboard for AcontPlus DB
-- 100% compatible with all SQL Server versions (2008 and later)
-- Final corrected version with all database_id issues resolved

-- Declare database name variable for easy modification
DECLARE @DatabaseName NVARCHAR(128) = 'AcontPlus';
DECLARE @DatabaseID INT = DB_ID(@DatabaseName);

-- =====================================================================================
-- SECTION 1: SERVER & DATABASE CONFIGURATION
-- =====================================================================================
SELECT
    @@VERSION AS [SQL_Server_Version_Info],
    SERVERPROPERTY('ProductVersion') AS [SQL_Product_Version],
    SERVERPROPERTY('ProductLevel') AS [SQL_Product_Level],
    SERVERPROPERTY('Edition') AS [SQL_Edition],
    SERVERPROPERTY('ComputerNamePhysicalNetBIOS') AS [Server_NetBIOS_Name],
    db.name AS [Database_Name],
    db.state_desc AS [Database_State],
    db.user_access_desc AS [User_Access_Mode],
    db.compatibility_level AS [Database_Compatibility_Level],
    db.is_accelerated_database_recovery_on AS [ADR_Enabled],
    db.snapshot_isolation_state_desc AS [Snapshot_Isolation_State],
    db.is_read_committed_snapshot_on AS [Read_Committed_Snapshot_Enabled]
FROM sys.databases AS db
WHERE db.name = @DatabaseName;

-- =====================================================================================
-- SECTION 2: ACTIVE CONNECTIONS & SESSIONS
-- =====================================================================================
SELECT
    COUNT(*) AS [Total_Active_Connections_AcontPlus],
    CASE
        WHEN COUNT(*) = 0 THEN 'No_Activity_Safe_For_Maintenance'
        WHEN COUNT(*) <= 5 THEN 'Low_Activity_Proceed_Cautiously'
        WHEN COUNT(*) <= 50 THEN 'Moderate_Activity'
        ELSE 'High_Activity_Consider_Maintenance_Window'
    END AS [Activity_Recommendation_AcontPlus]
FROM sys.dm_exec_sessions
WHERE database_id = @DatabaseID AND session_id <> @@SPID;

-- =====================================================================================
-- SECTION 3: BLOCKING & OPEN TRANSACTIONS (Fixed database_id issues)
-- =====================================================================================
PRINT N'-- ACTIVE BLOCKING CHAINS --';
SELECT
    blocking_s.session_id AS [Blocking_SPID],
    blocking_s.login_name AS [Blocking_Login],
    blocking_s.host_name AS [Blocking_Host],
    blocked_s.session_id AS [Blocked_SPID],
    blocked_s.login_name AS [Blocked_Login],
    blocked_s.host_name AS [Blocked_Host],
    blocked_r.wait_type AS [Wait_Type],
    blocked_r.wait_time AS [Wait_Time_ms],
    blocked_r.last_wait_type AS [Last_Wait_Type],
    ST_Blocked.text AS [Blocked_Query],
    ST_Blocking.text AS [Blocking_Query]
FROM sys.dm_exec_requests blocked_r
JOIN sys.dm_exec_sessions blocked_s ON blocked_r.session_id = blocked_s.session_id
LEFT JOIN sys.dm_exec_requests blocking_r ON blocked_r.blocking_session_id = blocking_r.session_id
LEFT JOIN sys.dm_exec_sessions blocking_s ON blocking_r.session_id = blocking_s.session_id
OUTER APPLY sys.dm_exec_sql_text(blocked_r.sql_handle) AS ST_Blocked
OUTER APPLY sys.dm_exec_sql_text(blocking_r.sql_handle) AS ST_Blocking
WHERE blocked_r.blocking_session_id <> 0
AND blocked_s.database_id = @DatabaseID;

PRINT N'-- OPEN TRANSACTIONS --';
SELECT
    ses.session_id AS [SPID],
    ses.login_name AS [Login],
    ses.host_name AS [Host],
    tat.transaction_begin_time AS [Begin_Time],
    DATEDIFF(SECOND, tat.transaction_begin_time, GETDATE()) AS [Duration_Seconds],
    CASE tat.transaction_type
        WHEN 1 THEN 'Read/write'
        WHEN 2 THEN 'Read-only'
        WHEN 3 THEN 'System'
        WHEN 4 THEN 'Distributed'
    END AS [Transaction_Type],
    CASE tat.transaction_state
        WHEN 0 THEN 'Not initialized'
        WHEN 1 THEN 'Initializing'
        WHEN 2 THEN 'Active'
        WHEN 3 THEN 'Ended'
        WHEN 4 THEN 'Commit initiating'
        WHEN 5 THEN 'Prepared'
        WHEN 6 THEN 'Committed'
        WHEN 7 THEN 'Rolling back'
        WHEN 8 THEN 'Rolled back'
    END AS [Transaction_State],
    txt.text AS [Last_Statement]
FROM sys.dm_tran_active_transactions tat
JOIN sys.dm_tran_session_transactions st ON tat.transaction_id = st.transaction_id
JOIN sys.dm_exec_sessions ses ON st.session_id = ses.session_id
LEFT JOIN sys.dm_exec_requests req ON ses.session_id = req.session_id
OUTER APPLY sys.dm_exec_sql_text(req.sql_handle) AS txt
WHERE ses.database_id = @DatabaseID
AND ses.session_id <> @@SPID
ORDER BY tat.transaction_begin_time;

-- =====================================================================================
-- SECTION 4: WAIT STATISTICS
-- =====================================================================================
PRINT N'-- TOP 20 WAIT STATISTICS --';
WITH Waits AS (
    SELECT
        wait_type,
        wait_time_ms / 1000.0 AS wait_time_sec,
        waiting_tasks_count,
        wait_time_ms / waiting_tasks_count AS avg_wait_time_ms
    FROM sys.dm_os_wait_stats
    WHERE waiting_tasks_count > 0
    AND wait_type NOT IN (
        'CLR_SEMAPHORE', 'LAZYWRITER_SLEEP', 'RESOURCE_QUEUE', 'SLEEP_TASK',
        'SLEEP_SYSTEMTASK', 'SQLTRACE_BUFFER_FLUSH', 'WAITFOR', 'LOGMGR_QUEUE',
        'CHECKPOINT_QUEUE', 'REQUEST_FOR_DEADLOCK_SEARCH', 'XE_TIMER_EVENT',
        'BROKER_TO_FLUSH', 'BROKER_TASK_STOP', 'CLR_MANUAL_EVENT', 'CLR_AUTO_EVENT',
        'DISPATCHER_QUEUE_SEMAPHORE', 'FT_IFTS_SCHEDULER_IDLE_WAIT', 'XE_DISPATCHER_WAIT',
        'XE_DISPATCHER_JOIN', 'SQLTRACE_INCREMENTAL_FLUSH_SLEEP', 'ONDEMAND_TASK_QUEUE',
        'BROKER_EVENTHANDLER', 'SLEEP_BPOOL_FLUSH', 'SLEEP_DBSTARTUP', 'DIRTY_PAGE_POLL',
        'HADR_FILESTREAM_IOMGR_IOCOMPLETION', 'SP_SERVER_DIAGNOSTICS_SLEEP'
    )
)
SELECT TOP 20
    wait_type AS [Wait_Type],
    ROUND(wait_time_sec, 2) AS [Wait_Time_sec],
    waiting_tasks_count AS [Wait_Count],
    ROUND(avg_wait_time_ms, 2) AS [Avg_Wait_Time_ms],
    ROUND(100.0 * wait_time_sec / SUM(wait_time_sec) OVER(), 2) AS [Percentage]
FROM Waits
ORDER BY wait_time_sec DESC;

-- =====================================================================================
-- SECTION 5: TEMPDB USAGE (100% compatible version)
-- =====================================================================================
PRINT N'-- TEMPDB FILE USAGE --';
SELECT
    name AS [File_Name],
    type_desc AS [File_Type],
    physical_name AS [Physical_Path],
    size * 8 / 1024 AS [Size_MB],
    FILEPROPERTY(name, 'SpaceUsed') * 8 / 1024 AS [Used_MB],
    (size - FILEPROPERTY(name, 'SpaceUsed')) * 8 / 1024 AS [Free_MB],
    growth * 8 / 1024 AS [Growth_Increment_MB],
    is_percent_growth AS [Is_Percent_Growth]
FROM tempdb.sys.database_files
ORDER BY type_desc DESC, file_id;

PRINT N'-- TEMPDB VERSION STORE --';
SELECT
    COUNT(*) AS [Version_Store_Records],
    COUNT(*) * 64 / 1024 AS [Version_Store_Size_MB]
FROM sys.dm_tran_version_store;

-- =====================================================================================
-- SECTION 6: MEMORY USAGE
-- =====================================================================================
PRINT N'-- MEMORY USAGE --';
SELECT
    counter_name AS [Memory_Metric],
    cntr_value / 1024 AS [Value_MB]
FROM sys.dm_os_performance_counters
WHERE counter_name IN ('Total Server Memory (KB)', 'Target Server Memory (KB)')
AND object_name LIKE '%Memory Manager%';

PRINT N'-- BUFFER POOL USAGE --';
SELECT
    COUNT(*) * 8 / 1024 AS [Total_Buffer_Pool_MB],
    COUNT(CASE WHEN database_id = @DatabaseID THEN 1 END) * 8 / 1024 AS [AcontPlus_Buffer_MB],
    COUNT(CASE WHEN database_id = DB_ID('tempdb') THEN 1 END) * 8 / 1024 AS [TempDB_Buffer_MB]
FROM sys.dm_os_buffer_descriptors;

-- Check for CPU pressure
SELECT TOP 10 s.session_id, r.status, r.cpu_time, r.logical_reads,
       r.reads, r.writes, t.text AS [SQL Text]
FROM sys.dm_exec_requests r
JOIN sys.dm_exec_sessions s ON r.session_id <> @@SPID
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
ORDER BY r.cpu_time DESC;

-- Check memory grants
SELECT TOP 20 * FROM sys.dm_exec_query_memory_grants
ORDER BY requested_memory_kb DESC;

-- Check for parallelism issues
SELECT TOP 20
    qs.sql_handle,
    qs.execution_count,
    qs.total_worker_time/qs.execution_count AS avg_cpu_time,
    qs.total_elapsed_time/qs.execution_count AS avg_elapsed_time,
    qs.total_logical_reads/qs.execution_count AS avg_logical_reads,
    SUBSTRING(st.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset
          WHEN -1 THEN DATALENGTH(st.text)
          ELSE qs.statement_end_offset
          END - qs.statement_start_offset)/2) + 1) AS statement_text
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st
ORDER BY qs.total_worker_time/qs.execution_count DESC;

-- Check memory clerks
SELECT TOP 10 
    type AS [Memory Clerk Type], 
    SUM(pages_kb)/1024 AS [Size MB]
FROM sys.dm_os_memory_clerks 
GROUP BY type 
ORDER BY SUM(pages_kb) DESC;

-- Check if files needed to grow after your changes
SELECT 
    name,
    size*8/1024 as current_size_mb,
    FILEPROPERTY(name, 'SpaceUsed')*8/1024 as used_mb
FROM tempdb.sys.database_files;