SELECT 
    type,
    name,
    pages_kb/1024 AS [Memory (MB)],
    pages_kb/(SELECT SUM(pages_kb)/1024.0 FROM sys.dm_os_memory_clerks)*100 AS [% of Total]
FROM sys.dm_os_memory_clerks
ORDER BY pages_kb DESC;

SELECT TOP 10
    type AS [Memory Clerk Type],
    name AS [Memory Clerk Name],
    pages_kb/1024 AS [Memory Usage (MB)],
    (pages_kb/(SELECT SUM(pages_kb)*1.0 FROM sys.dm_os_memory_clerks))*100 AS [% of Total]
FROM sys.dm_os_memory_clerks
ORDER BY pages_kb DESC;

SELECT 
    --event_time,
    record.value('(/Record/ResourceMonitor/Notification)[1]', 'varchar(100)') AS [Notification],
    record.value('(/Record/ResourceMonitor/IndicatorsProcess)[1]', 'int') AS [IndicatorsProcess],
    record.value('(/Record/ResourceMonitor/IndicatorsSystem)[1]', 'int') AS [IndicatorsSystem]
FROM (
    SELECT TOP 10
        --DATEADD(ss, (-1 * ((cpu_ticks / CONVERT(float, cpu_ticks_in_ms)) - (timestamp / CONVERT(float, cpu_ticks_in_ms)))), GETDATE()) AS event_time,
        CONVERT(xml, record) AS record
    FROM sys.dm_os_ring_buffers
    WHERE ring_buffer_type = 'RING_BUFFER_RESOURCE_MONITOR'
    ORDER BY timestamp DESC
) AS tab;

SELECT
    COUNT(*) * 8 / 1024 AS [Total MB],
    SUM(CASE WHEN is_modified = 1 THEN 1 ELSE 0 END) * 8 / 1024 AS [Dirty MB],
    SUM(CASE WHEN is_modified = 1 THEN 0 ELSE 1 END) * 8 / 1024 AS [Clean MB],
    SUM(CASE WHEN database_id = 32767 THEN 1 ELSE 0 END) * 8 / 1024 AS [ResourceDB MB]
FROM sys.dm_os_buffer_descriptors;

SELECT TOP 10
    qs.sql_handle,
    qs.execution_count,
    qs.total_logical_reads/qs.execution_count AS avg_logical_reads,
    qs.total_elapsed_time/qs.execution_count AS avg_elapsed_time,
    qs.total_worker_time/qs.execution_count AS avg_cpu_time,
    qs.total_logical_writes/qs.execution_count AS avg_logical_writes,
    qs.max_logical_reads,
    qs.max_elapsed_time,
    qs.max_worker_time,
    qs.creation_time,
    qt.text AS query_text,
    qp.query_plan
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
CROSS APPLY sys.dm_exec_query_plan(qs.plan_handle) qp
ORDER BY qs.total_logical_reads DESC;