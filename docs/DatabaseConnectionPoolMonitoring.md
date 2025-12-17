# Database Connection Pool Monitoring Guide

## Overview
This document provides guidance for monitoring and optimizing SQL Server connection pools in the AcontPlus high-workload system.

## Connection String Optimizations Applied

### Development Environment
```
Max Pool Size=300
Min Pool Size=20
Connection Timeout=30
ConnectRetryCount=3
ConnectRetryInterval=10
Connection Lifetime=0
Command Timeout=60
Application Name=AcontPlus-Dev
Packet Size=8192
```

### Staging Environment
```
Max Pool Size=400
Min Pool Size=30
Connection Timeout=35
ConnectRetryCount=3
ConnectRetryInterval=10
Connection Lifetime=0
Command Timeout=75
Application Name=AcontPlus-Staging
Packet Size=12288
```

### Production Environment
```
Max Pool Size=500
Min Pool Size=50
Connection Timeout=45
ConnectRetryCount=3
ConnectRetryInterval=10
Connection Lifetime=0
Command Timeout=90
Application Name=AcontPlus-PRD
Load Balance Timeout=5
Packet Size=16384
```

## Key Parameters Explained

### Connection Resilience
- **ConnectRetryCount=3**: Automatically retries failed connections up to 3 times
- **ConnectRetryInterval=10**: Waits 10 seconds between retry attempts
- **Purpose**: Handles transient network failures and temporary database unavailability

### Connection Pooling
- **Max Pool Size**: Maximum number of connections in the pool
  - Dev: 300 connections
  - Staging: 400 connections
  - Production: 500 connections
- **Min Pool Size**: Minimum number of connections always maintained
  - Dev: 20 connections
  - Staging: 30 connections
  - Production: 50 connections
- **Connection Lifetime=0**: Connections never expire (optimal for stable systems)

### Performance Optimization
- **Command Timeout**: Maximum time (in seconds) for a command to execute
  - Dev: 60 seconds
  - Staging: 75 seconds
  - Production: 90 seconds
- **Packet Size**: Size of network packets used for data transfer
  - Dev: 8KB (8192 bytes)
  - Staging: 12KB (12288 bytes)
  - Production: 16KB (16384 bytes) - Optimized for bulk operations

### Monitoring & Diagnostics
- **Application Name**: Identifies the application in SQL Server traces and DMVs
  - Makes it easier to filter and monitor application-specific connections
  - Format: `AcontPlus-{Environment}`

## SQL Server Monitoring Queries

### 1. Check Connection Pool Usage
```sql
-- View current connections by application
SELECT 
    program_name AS ApplicationName,
    COUNT(*) AS ConnectionCount,
    DB_NAME(database_id) AS DatabaseName,
    login_name AS LoginName,
    host_name AS HostName,
    status AS Status
FROM sys.dm_exec_sessions
WHERE program_name LIKE 'AcontPlus%'
GROUP BY program_name, database_id, login_name, host_name, status
ORDER BY ConnectionCount DESC;
```

### 2. Monitor Connection Pool Exhaustion
```sql
-- Check for connection timeout errors
SELECT 
    program_name,
    COUNT(*) as ErrorCount,
    MAX(last_request_end_time) as LastError
FROM sys.dm_exec_sessions
WHERE program_name LIKE 'AcontPlus%'
AND status = 'sleeping'
AND DATEDIFF(MINUTE, last_request_end_time, GETDATE()) > 5
GROUP BY program_name;
```

### 3. Identify Long-Running Queries
```sql
-- Find queries exceeding command timeout threshold
SELECT 
    s.session_id,
    s.program_name,
    r.start_time,
    DATEDIFF(SECOND, r.start_time, GETDATE()) AS DurationSeconds,
    r.status,
    r.command,
    DB_NAME(r.database_id) AS DatabaseName,
    t.text AS QueryText,
    r.wait_type,
    r.wait_time,
    r.blocking_session_id
FROM sys.dm_exec_requests r
INNER JOIN sys.dm_exec_sessions s ON r.session_id = s.session_id
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE s.program_name LIKE 'AcontPlus%'
AND DATEDIFF(SECOND, r.start_time, GETDATE()) > 30
ORDER BY DurationSeconds DESC;
```

### 4. Monitor Connection Churn
```sql
-- Track connection creation/destruction rate
SELECT 
    SUBSTRING(program_name, 1, 20) AS App,
    COUNT(*) AS TotalConnections,
    SUM(CASE WHEN status = 'sleeping' THEN 1 ELSE 0 END) AS SleepingConnections,
    SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) AS ActiveConnections,
    AVG(DATEDIFF(SECOND, login_time, GETDATE())) AS AvgConnectionAgeSeconds
FROM sys.dm_exec_sessions
WHERE program_name LIKE 'AcontPlus%'
GROUP BY SUBSTRING(program_name, 1, 20);
```

## Application-Level Monitoring

### .NET Performance Counters
Monitor these performance counters for your application:

```csharp
// Example: Monitor SQL Server connection pool metrics
// Category: .NET Data Provider for SqlServer
// Counters to watch:
- NumberOfActiveConnectionPools
- NumberOfActiveConnections
- NumberOfFreeConnections
- NumberOfPooledConnections
- NumberOfReclaimedConnections
- NumberOfStasisConnections
```

### Recommended Monitoring Implementation

```csharp
// Add to your service configuration (e.g., Program.cs or Startup.cs)
using System.Diagnostics;

public class ConnectionPoolMonitor
{
    private readonly PerformanceCounter _activeConnections;
    private readonly PerformanceCounter _pooledConnections;
    private readonly ILogger<ConnectionPoolMonitor> _logger;

    public ConnectionPoolMonitor(ILogger<ConnectionPoolMonitor> logger)
    {
        _logger = logger;
        
        try
        {
            _activeConnections = new PerformanceCounter(
                ".NET Data Provider for SqlServer",
                "NumberOfActiveConnections",
                instanceName: "YourAppPoolInstance",
                readOnly: true
            );

            _pooledConnections = new PerformanceCounter(
                ".NET Data Provider for SqlServer",
                "NumberOfPooledConnections",
                instanceName: "YourAppPoolInstance",
                readOnly: true
            );
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to initialize connection pool performance counters");
        }
    }

    public void LogConnectionPoolMetrics()
    {
        try
        {
            var active = _activeConnections?.NextValue() ?? 0;
            var pooled = _pooledConnections?.NextValue() ?? 0;

            _logger.LogInformation(
                "Connection Pool Metrics - Active: {Active}, Pooled: {Pooled}",
                active, pooled
            );

            // Alert if approaching max pool size
            if (active > 400) // 80% of max for production (500)
            {
                _logger.LogWarning(
                    "Connection pool usage high: {Active} active connections",
                    active
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading connection pool metrics");
        }
    }
}
```

## Alerts & Thresholds

### Critical Alerts (Immediate Action Required)
- **Active Connections > 90% of Max Pool Size**
  - Dev: > 270 connections
  - Staging: > 360 connections
  - Production: > 450 connections
  
- **Connection Timeout Errors** occurring
- **Command Timeout Errors** exceeding 5% of total queries

### Warning Alerts (Monitor Closely)
- **Active Connections > 70% of Max Pool Size**
  - Dev: > 210 connections
  - Staging: > 280 connections
  - Production: > 350 connections

- **Average Connection Age** > 300 seconds (possible connection leaks)
- **Sleeping Connections** > 50% of total connections

## Troubleshooting Common Issues

### 1. Connection Pool Exhaustion
**Symptoms**: "Timeout expired. The timeout period elapsed prior to obtaining a connection from the pool."

**Solutions**:
- Verify all connections are properly disposed (use `using` statements)
- Check for connection leaks in exception handling
- Review long-running transactions
- Consider increasing Max Pool Size (temporarily)
- Review application code for proper async/await patterns

### 2. Connection Timeout Errors
**Symptoms**: "A connection was successfully established with the server, but then an error occurred during the login process."

**Solutions**:
- Verify network connectivity to SQL Server
- Check SQL Server is running and accepting connections
- Review firewall rules
- Verify credentials are correct
- Check SQL Server error logs for authentication failures

### 3. Command Timeout Errors
**Symptoms**: "Execution Timeout Expired. The timeout period elapsed prior to completion of the operation."

**Solutions**:
- Optimize slow queries (check execution plans)
- Add appropriate indexes
- Consider query pagination for large result sets
- Review Command Timeout values (may need increase for specific scenarios)
- Implement query hints if necessary

### 4. High Connection Churn
**Symptoms**: Constant connection creation/destruction

**Solutions**:
- Increase Min Pool Size to reduce connection creation overhead
- Review application connection usage patterns
- Implement connection retry logic
- Consider using connection pooling at application level

## Best Practices

### 1. Always Use Connection Pooling
✅ **DO**: Let the connection pool manage connections
```csharp
using (var connection = new SqlConnection(connectionString))
{
    await connection.OpenAsync();
    // Use connection
} // Connection returned to pool, not destroyed
```

❌ **DON'T**: Manually manage connection lifetime beyond scope
```csharp
var connection = new SqlConnection(connectionString);
// Connection leaked if exception occurs before disposal
```

### 2. Properly Dispose Resources
✅ **DO**: Use `using` statements or `await using` for async
```csharp
await using var connection = new SqlConnection(connectionString);
await using var command = connection.CreateCommand();
```

### 3. Handle Transient Failures
✅ **DO**: Implement retry logic for transient errors
```csharp
// Connection string already includes ConnectRetryCount=3
// Additional application-level retry for resilience:
var retryPolicy = Policy
    .Handle<SqlException>(ex => ex.IsTransient())
    .WaitAndRetryAsync(3, retryAttempt => 
        TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))
    );

await retryPolicy.ExecuteAsync(async () =>
{
    await using var connection = new SqlConnection(connectionString);
    await connection.OpenAsync();
    // Execute queries
});
```

### 4. Monitor and Log
✅ **DO**: Log connection pool metrics periodically
```csharp
// In your background service or health check
public class ConnectionPoolHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        // Check connection pool metrics
        // Return healthy/degraded/unhealthy based on thresholds
    }
}
```

## Performance Tuning Guidelines

### When to Increase Max Pool Size
- Sustained high connection usage (> 80% of max)
- Frequent pool exhaustion errors
- High concurrent user load
- Multiple services sharing same database

### When to Increase Min Pool Size
- Reduce connection creation latency
- Application has consistent base load
- Connection creation is expensive (network latency)

### When to Adjust Command Timeout
- Complex reporting queries require more time
- Batch operations processing large datasets
- Background jobs with long-running operations

### When to Adjust Packet Size
- Large data transfers (BLOBs, large result sets)
- High-bandwidth, low-latency network
- Bulk insert/update operations

## Maintenance Tasks

### Daily
- Review connection pool usage graphs
- Check for timeout errors in logs
- Monitor average query execution times

### Weekly
- Analyze slow query logs
- Review connection pool configuration
- Check for connection leaks (increasing sleeping connections)

### Monthly
- Review SQL Server wait statistics
- Analyze query execution plans
- Update monitoring thresholds based on growth
- Review and optimize connection string parameters

## Additional Resources

### SQL Server DMVs Reference
- `sys.dm_exec_sessions`: Current session information
- `sys.dm_exec_requests`: Current request information
- `sys.dm_exec_connections`: Connection information
- `sys.dm_os_wait_stats`: Wait statistics
- `sys.dm_exec_query_stats`: Query execution statistics

### Useful Links
- [SQL Server Connection Pooling](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/sql-server-connection-pooling)
- [Connection String Parameters](https://docs.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlconnection.connectionstring)
- [SQL Server Performance Monitoring](https://docs.microsoft.com/en-us/sql/relational-databases/performance/monitor-and-tune-for-performance)

---

**Last Updated**: December 2025
**Document Version**: 1.0
**Maintainer**: Development Team
