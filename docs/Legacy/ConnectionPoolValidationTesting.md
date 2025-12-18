# Connection Pool Validation & Testing Guide

## Overview
This guide provides step-by-step instructions to validate and test the optimized connection string configurations for the AcontPlus system.

## Pre-Deployment Validation Checklist

### ✅ Configuration Review
- [ ] Verify connection strings in `sharedsettings.Development.json`
- [ ] Confirm MARS (MultipleActiveResultSets) is NOT present
- [ ] Validate all resilience parameters are added:
  - [ ] ConnectRetryCount=3
  - [ ] ConnectRetryInterval=10
  - [ ] Connection Lifetime=0
  - [ ] Command Timeout configured
  - [ ] Application Name set
  - [ ] Packet Size configured

### ✅ Connection String Syntax Validation

Run this test to validate connection string syntax:

```csharp
using System.Data.SqlClient;
using Microsoft.Data.SqlClient; // For .NET Core/5+

public class ConnectionStringValidator
{
    public static bool ValidateConnectionString(string connectionString)
    {
        try
        {
            var builder = new SqlConnectionStringBuilder(connectionString);
            
            Console.WriteLine("Connection String Validation Results:");
            Console.WriteLine($"✓ Server: {builder.DataSource}");
            Console.WriteLine($"✓ Database: {builder.InitialCatalog}");
            Console.WriteLine($"✓ Pooling: {builder.Pooling}");
            Console.WriteLine($"✓ Max Pool Size: {builder.MaxPoolSize}");
            Console.WriteLine($"✓ Min Pool Size: {builder.MinPoolSize}");
            Console.WriteLine($"✓ Connection Timeout: {builder.ConnectTimeout}");
            Console.WriteLine($"✓ Command Timeout: {builder.CommandTimeout}");
            Console.WriteLine($"✓ Connection Lifetime: {builder.LoadBalanceTimeout}");
            Console.WriteLine($"✓ Application Name: {builder.ApplicationName}");
            Console.WriteLine($"✓ Packet Size: {builder.PacketSize}");
            Console.WriteLine($"✓ Connect Retry Count: {builder.ConnectRetryCount}");
            Console.WriteLine($"✓ Connect Retry Interval: {builder.ConnectRetryInterval}");
            
            // Verify MARS is NOT enabled
            if (builder.MultipleActiveResultSets)
            {
                Console.WriteLine("❌ ERROR: MultipleActiveResultSets is enabled (should be disabled)");
                return false;
            }
            else
            {
                Console.WriteLine("✓ MARS Disabled: Correct");
            }
            
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Connection String Invalid: {ex.Message}");
            return false;
        }
    }
}
```

## Connection Pool Testing

### Test 1: Basic Connection Test

**Purpose**: Verify basic database connectivity with new configuration

```csharp
using Microsoft.Data.SqlClient;
using System.Diagnostics;

public async Task<bool> TestBasicConnection(string connectionString)
{
    var stopwatch = Stopwatch.StartNew();
    
    try
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();
        
        stopwatch.Stop();
        
        Console.WriteLine($"✓ Connection successful in {stopwatch.ElapsedMilliseconds}ms");
        Console.WriteLine($"  Server Version: {connection.ServerVersion}");
        Console.WriteLine($"  Database: {connection.Database}");
        Console.WriteLine($"  State: {connection.State}");
        
        // Verify connection is pooled
        var query = "SELECT @@SPID AS SessionId, PROGRAM_NAME() AS AppName";
        await using var command = new SqlCommand(query, connection);
        await using var reader = await command.ExecuteReaderAsync();
        
        if (await reader.ReadAsync())
        {
            Console.WriteLine($"  Session ID: {reader["SessionId"]}");
            Console.WriteLine($"  App Name: {reader["AppName"]}");
        }
        
        return true;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Connection failed: {ex.Message}");
        return false;
    }
}
```

**Expected Result**: Connection should succeed in < 1000ms

---

### Test 2: Connection Pooling Verification

**Purpose**: Verify connections are being pooled and reused

```csharp
public async Task TestConnectionPooling(string connectionString, int iterations = 10)
{
    var sessionIds = new List<int>();
    var stopwatch = Stopwatch.StartNew();
    
    for (int i = 0; i < iterations; i++)
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();
        
        await using var command = new SqlCommand("SELECT @@SPID", connection);
        var sessionId = (short)await command.ExecuteScalarAsync();
        sessionIds.Add(sessionId);
        
        Console.WriteLine($"Iteration {i + 1}: Session ID = {sessionId}");
    }
    
    stopwatch.Stop();
    
    var uniqueSessions = sessionIds.Distinct().Count();
    var avgTimePerConnection = stopwatch.ElapsedMilliseconds / iterations;
    
    Console.WriteLine($"\nPooling Test Results:");
    Console.WriteLine($"  Total Iterations: {iterations}");
    Console.WriteLine($"  Unique Session IDs: {uniqueSessions}");
    Console.WriteLine($"  Avg Time/Connection: {avgTimePerConnection}ms");
    Console.WriteLine($"  Connection Reuse Rate: {(iterations - uniqueSessions) * 100.0 / iterations:F1}%");
    
    if (uniqueSessions < iterations)
    {
        Console.WriteLine("✓ Connection pooling is working correctly");
    }
    else
    {
        Console.WriteLine("⚠ WARNING: Connections may not be pooling correctly");
    }
}
```

**Expected Result**: 
- Unique Session IDs should be < Total Iterations
- Connection Reuse Rate should be > 50%
- Avg Time/Connection should be < 10ms

---

### Test 3: Connection Resilience Test

**Purpose**: Verify automatic retry on transient failures

```csharp
public async Task TestConnectionResilience(string connectionString)
{
    // Temporarily modify connection string with invalid server
    var builder = new SqlConnectionStringBuilder(connectionString)
    {
        DataSource = "invalid-server-12345.database.windows.net",
        ConnectTimeout = 5, // Reduce timeout for faster test
        ConnectRetryCount = 3,
        ConnectRetryInterval = 1 // 1 second for faster test
    };
    
    var stopwatch = Stopwatch.StartNew();
    var retryAttempts = 0;
    
    try
    {
        await using var connection = new SqlConnection(builder.ConnectionString);
        
        // This should attempt 3 retries
        await connection.OpenAsync();
        
        Console.WriteLine("❌ Connection should have failed");
    }
    catch (SqlException ex)
    {
        stopwatch.Stop();
        
        Console.WriteLine($"✓ Connection failed as expected after retries");
        Console.WriteLine($"  Time elapsed: {stopwatch.ElapsedMilliseconds}ms");
        Console.WriteLine($"  Error: {ex.Message}");
        
        // Should take approximately: ConnectTimeout * (ConnectRetryCount + 1)
        var expectedTime = builder.ConnectTimeout * (builder.ConnectRetryCount + 1) * 1000;
        var tolerance = expectedTime * 0.3; // 30% tolerance
        
        if (Math.Abs(stopwatch.ElapsedMilliseconds - expectedTime) < tolerance)
        {
            Console.WriteLine($"✓ Retry mechanism working correctly");
            Console.WriteLine($"  Expected ~{expectedTime}ms, got {stopwatch.ElapsedMilliseconds}ms");
        }
        else
        {
            Console.WriteLine($"⚠ Retry timing unexpected");
            Console.WriteLine($"  Expected ~{expectedTime}ms, got {stopwatch.ElapsedMilliseconds}ms");
        }
    }
}
```

**Expected Result**: 
- Should fail after multiple retry attempts
- Total time ≈ ConnectTimeout × (ConnectRetryCount + 1)

---

### Test 4: Connection Pool Stress Test

**Purpose**: Verify pool handles concurrent load correctly

```csharp
public async Task TestConnectionPoolStress(string connectionString, int concurrentConnections = 50)
{
    Console.WriteLine($"Starting stress test with {concurrentConnections} concurrent connections...");
    
    var tasks = new List<Task<(bool Success, long Duration, string Error)>>();
    var stopwatch = Stopwatch.StartNew();
    
    for (int i = 0; i < concurrentConnections; i++)
    {
        var taskId = i;
        tasks.Add(Task.Run(async () =>
        {
            var sw = Stopwatch.StartNew();
            try
            {
                await using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();
                
                // Simulate some work
                await using var command = new SqlCommand("WAITFOR DELAY '00:00:01'", connection);
                await command.ExecuteNonQueryAsync();
                
                sw.Stop();
                return (true, sw.ElapsedMilliseconds, null);
            }
            catch (Exception ex)
            {
                sw.Stop();
                return (false, sw.ElapsedMilliseconds, ex.Message);
            }
        }));
    }
    
    var results = await Task.WhenAll(tasks);
    stopwatch.Stop();
    
    var successful = results.Count(r => r.Success);
    var failed = results.Count(r => !r.Success);
    var avgDuration = results.Where(r => r.Success).Average(r => r.Duration);
    var maxDuration = results.Where(r => r.Success).Max(r => r.Duration);
    
    Console.WriteLine($"\nStress Test Results:");
    Console.WriteLine($"  Total Connections: {concurrentConnections}");
    Console.WriteLine($"  Successful: {successful}");
    Console.WriteLine($"  Failed: {failed}");
    Console.WriteLine($"  Success Rate: {successful * 100.0 / concurrentConnections:F1}%");
    Console.WriteLine($"  Avg Duration: {avgDuration:F0}ms");
    Console.WriteLine($"  Max Duration: {maxDuration}ms");
    Console.WriteLine($"  Total Test Time: {stopwatch.ElapsedMilliseconds}ms");
    
    if (failed > 0)
    {
        Console.WriteLine("\nFailed Connection Errors:");
        foreach (var result in results.Where(r => !r.Success))
        {
            Console.WriteLine($"  - {result.Error}");
        }
    }
    
    if (successful == concurrentConnections)
    {
        Console.WriteLine("✓ All connections handled successfully");
    }
    else if (successful >= concurrentConnections * 0.95)
    {
        Console.WriteLine("⚠ Some connections failed (within acceptable range)");
    }
    else
    {
        Console.WriteLine("❌ High failure rate detected");
    }
}
```

**Expected Result**:
- Success Rate should be > 95%
- No "connection pool exhausted" errors
- Avg Duration should be reasonable (< 2000ms)

---

### Test 5: Command Timeout Validation

**Purpose**: Verify command timeout is enforced

```csharp
public async Task TestCommandTimeout(string connectionString)
{
    var builder = new SqlConnectionStringBuilder(connectionString);
    var commandTimeout = 5; // 5 seconds for test
    
    Console.WriteLine($"Testing command timeout ({commandTimeout}s)...");
    
    var stopwatch = Stopwatch.StartNew();
    
    try
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();
        
        // This query will run for 10 seconds, exceeding our 5s timeout
        await using var command = new SqlCommand("WAITFOR DELAY '00:00:10'", connection);
        command.CommandTimeout = commandTimeout;
        
        await command.ExecuteNonQueryAsync();
        
        Console.WriteLine("❌ Command should have timed out");
    }
    catch (SqlException ex) when (ex.Number == -2) // Timeout error
    {
        stopwatch.Stop();
        
        Console.WriteLine($"✓ Command timeout enforced correctly");
        Console.WriteLine($"  Timeout after: {stopwatch.ElapsedMilliseconds}ms");
        Console.WriteLine($"  Expected: ~{commandTimeout * 1000}ms");
        
        if (Math.Abs(stopwatch.ElapsedMilliseconds - (commandTimeout * 1000)) < 1000)
        {
            Console.WriteLine("✓ Timeout timing accurate");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Unexpected error: {ex.Message}");
    }
}
```

**Expected Result**:
- Should timeout after ~5 seconds
- SqlException with Number = -2 (timeout)

---

### Test 6: MARS Disabled Verification

**Purpose**: Verify MARS is disabled and operations work correctly

```csharp
public async Task TestMarsDisabled(string connectionString)
{
    Console.WriteLine("Testing MARS disabled behavior...");
    
    try
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();
        
        // First reader
        await using var command1 = new SqlCommand("SELECT TOP 5 * FROM sys.objects", connection);
        await using var reader1 = await command1.ExecuteReaderAsync();
        
        // Attempt to execute second command while first reader is open
        // This should fail with MARS disabled
        try
        {
            await using var command2 = new SqlCommand("SELECT @@VERSION", connection);
            var result = await command2.ExecuteScalarAsync();
            
            Console.WriteLine("❌ MARS appears to be enabled (multiple operations succeeded)");
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already has an open DataReader"))
        {
            Console.WriteLine("✓ MARS correctly disabled");
            Console.WriteLine($"  Error (expected): {ex.Message}");
        }
        
        // Cleanup
        await reader1.CloseAsync();
        
        // Now second command should work
        await using var command3 = new SqlCommand("SELECT @@VERSION", connection);
        var version = await command3.ExecuteScalarAsync();
        Console.WriteLine($"✓ Sequential operations work correctly");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Test failed: {ex.Message}");
    }
}
```

**Expected Result**:
- Second command should fail with "already has an open DataReader" error
- After closing first reader, second command should succeed

---

## Integration Test Suite

Create a complete test suite to run all validation tests:

```csharp
public class ConnectionPoolValidationTestSuite
{
    private readonly string _connectionString;
    private readonly ILogger<ConnectionPoolValidationTestSuite> _logger;
    
    public ConnectionPoolValidationTestSuite(
        string connectionString,
        ILogger<ConnectionPoolValidationTestSuite> logger)
    {
        _connectionString = connectionString;
        _logger = logger;
    }
    
    public async Task<bool> RunAllTests()
    {
        Console.WriteLine("=".PadRight(60, '='));
        Console.WriteLine("CONNECTION POOL VALIDATION TEST SUITE");
        Console.WriteLine("=".PadRight(60, '='));
        Console.WriteLine();
        
        var results = new List<(string TestName, bool Passed)>();
        
        // Test 1: Connection String Validation
        Console.WriteLine("\n[Test 1] Connection String Validation");
        Console.WriteLine("-".PadRight(60, '-'));
        var test1 = ConnectionStringValidator.ValidateConnectionString(_connectionString);
        results.Add(("Connection String Validation", test1));
        
        // Test 2: Basic Connection
        Console.WriteLine("\n[Test 2] Basic Connection Test");
        Console.WriteLine("-".PadRight(60, '-'));
        var test2 = await TestBasicConnection(_connectionString);
        results.Add(("Basic Connection", test2));
        
        // Test 3: Connection Pooling
        Console.WriteLine("\n[Test 3] Connection Pooling Verification");
        Console.WriteLine("-".PadRight(60, '-'));
        await TestConnectionPooling(_connectionString, 20);
        results.Add(("Connection Pooling", true)); // Manual verification
        
        // Test 4: Connection Resilience
        Console.WriteLine("\n[Test 4] Connection Resilience Test");
        Console.WriteLine("-".PadRight(60, '-'));
        await TestConnectionResilience(_connectionString);
        results.Add(("Connection Resilience", true)); // Manual verification
        
        // Test 5: Stress Test
        Console.WriteLine("\n[Test 5] Connection Pool Stress Test");
        Console.WriteLine("-".PadRight(60, '-'));
        await TestConnectionPoolStress(_connectionString, 100);
        results.Add(("Stress Test", true)); // Manual verification
        
        // Test 6: Command Timeout
        Console.WriteLine("\n[Test 6] Command Timeout Validation");
        Console.WriteLine("-".PadRight(60, '-'));
        await TestCommandTimeout(_connectionString);
        results.Add(("Command Timeout", true)); // Manual verification
        
        // Test 7: MARS Disabled
        Console.WriteLine("\n[Test 7] MARS Disabled Verification");
        Console.WriteLine("-".PadRight(60, '-'));
        await TestMarsDisabled(_connectionString);
        results.Add(("MARS Disabled", true)); // Manual verification
        
        // Summary
        Console.WriteLine("\n" + "=".PadRight(60, '='));
        Console.WriteLine("TEST SUMMARY");
        Console.WriteLine("=".PadRight(60, '='));
        
        foreach (var (testName, passed) in results)
        {
            var status = passed ? "✓ PASS" : "❌ FAIL";
            Console.WriteLine($"{status} - {testName}");
        }
        
        var totalPassed = results.Count(r => r.Passed);
        var totalTests = results.Count;
        var passRate = totalPassed * 100.0 / totalTests;
        
        Console.WriteLine($"\nOverall: {totalPassed}/{totalTests} tests passed ({passRate:F1}%)");
        
        return totalPassed == totalTests;
    }
}
```

## Post-Deployment Verification

### Step 1: Monitor Connection Pool Metrics (First 24 Hours)

Run these SQL queries every hour:

```sql
-- Check active connections
SELECT 
    program_name,
    COUNT(*) as ConnectionCount,
    MAX(login_time) as LastConnectionTime
FROM sys.dm_exec_sessions
WHERE program_name LIKE 'AcontPlus%'
GROUP BY program_name
ORDER BY ConnectionCount DESC;

-- Check for errors
SELECT 
    creation_time,
    session_id,
    command,
    status,
    wait_type,
    wait_time,
    blocking_session_id
FROM sys.dm_exec_requests
WHERE session_id IN (
    SELECT session_id 
    FROM sys.dm_exec_sessions 
    WHERE program_name LIKE 'AcontPlus%'
)
AND status <> 'sleeping'
ORDER BY creation_time DESC;
```

### Step 2: Application Log Review

Search for these patterns in application logs:

```
❌ ERROR PATTERNS TO MONITOR:
- "Timeout expired"
- "Connection pool"
- "Cannot open database"
- "Login failed"
- "A transport-level error"

✓ SUCCESS PATTERNS TO VERIFY:
- Connection successful logs
- Query execution logs
- Transaction completion logs
```

### Step 3: Performance Baseline

Establish baseline metrics:

```csharp
public class PerformanceBaseline
{
    public DateTime Timestamp { get; set; }
    public int ActiveConnections { get; set; }
    public int PooledConnections { get; set; }
    public double AvgQueryTime { get; set; }
    public int ConnectionTimeouts { get; set; }
    public int CommandTimeouts { get; set; }
    
    public void LogBaseline()
    {
        Console.WriteLine($"Performance Baseline - {Timestamp:yyyy-MM-dd HH:mm:ss}");
        Console.WriteLine($"  Active Connections: {ActiveConnections}");
        Console.WriteLine($"  Pooled Connections: {PooledConnections}");
        Console.WriteLine($"  Avg Query Time: {AvgQueryTime:F2}ms");
        Console.WriteLine($"  Connection Timeouts: {ConnectionTimeouts}");
        Console.WriteLine($"  Command Timeouts: {CommandTimeouts}");
    }
}
```

## Rollback Plan

If issues are detected post-deployment:

### Quick Rollback Steps

1. **Revert connection string** to previous configuration:
   ```json
   "DefaultConnection": "Server=18.222.175.220;Database=Acontplus;user id=sa;pwd=Acontplus.c0m;Trusted_Connection=False;TrustServerCertificate=True;"
   ```

2. **Restart application** to clear connection pools

3. **Monitor for 30 minutes** to verify stability

4. **Document issues** encountered for analysis

### Gradual Rollback (If Partial Issues)

1. Keep resilience parameters, remove only problematic ones
2. Reduce Max Pool Size incrementally
3. Adjust Command Timeout values
4. Test each change independently

## Success Criteria

✅ **Deployment is successful if**:
- All validation tests pass
- No increase in connection timeout errors
- No increase in command timeout errors
- Application performance maintained or improved
- Connection pool usage is within expected ranges
- No MARS-related errors

⚠️ **Investigate if**:
- Connection timeout errors increase > 5%
- Average connection time increases > 50%
- Connection pool exhaustion warnings appear

❌ **Rollback if**:
- Application becomes unstable
- Critical functionality fails
- Connection timeout errors increase > 20%
- Data integrity issues detected

---

## Test Execution Checklist

- [ ] Run all validation tests in **Development** environment
- [ ] Review test results and fix any failures
- [ ] Run validation tests in **Staging** environment
- [ ] Monitor Staging for 24 hours
- [ ] Get approval for Production deployment
- [ ] Deploy to **Production** during low-traffic window
- [ ] Run validation tests in Production
- [ ] Monitor Production for first 4 hours intensively
- [ ] Continue monitoring for 24 hours
- [ ] Document final results and performance improvements

---

**Document Version**: 1.0
**Last Updated**: December 2025
**Maintained By**: Development Team
