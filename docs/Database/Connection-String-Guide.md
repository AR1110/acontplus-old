# Database Connection String Configuration Guide

> **Comprehensive guide for configuring and optimizing SQL Server connection strings across all AcontPlus environments**

## 📋 Overview

This guide consolidates all connection string configuration, optimization, testing, and monitoring for the AcontPlus platform.

## 🎯 Quick Reference

| Environment | Max Pool | Min Pool | Timeout | Packet Size | Use Case |
|-------------|----------|----------|---------|-------------|----------|
| **Local Dev** | 50 | 5 | 30s | 8KB | Single developer |
| **Development** | 300 | 20 | 30s | 8KB | Multi-service dev |
| **Staging** | 400 | 30 | 35s | 12KB | Pre-production testing |
| **Production** | 500 | 50 | 45s | 16KB | High-volume production |

## 🔧 Configuration by Environment

### Local Development (Localhost SQL Server)

**Scenario:** SQL Server on developer's machine, 1-3 services in debug mode

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=Acontplus;user id=sa;pwd=YOUR_PASSWORD;Trusted_Connection=False;TrustServerCertificate=True;Pooling=true;Max Pool Size=50;Min Pool Size=5;Connection Timeout=30;ConnectRetryCount=2;ConnectRetryInterval=5;Connection Lifetime=0;Command Timeout=60;Application Name=AcontPlus-LocalDev-{ServiceName};Packet Size=8192;"
  }
}
```

**Key Settings:**
- **Max Pool Size: 50** - Sufficient for 1-3 services
- **Min Pool Size: 5** - Small pool for low traffic
- **Connection Timeout: 30s** - Standard timeout
- **ConnectRetryCount: 2** - Fewer retries (fail fast in dev)
- **Packet Size: 8KB** - Standard packet size
- **TrustServerCertificate: True** - No SSL in local dev

---

### Development Environment (Shared Dev Server)

**Scenario:** Remote SQL Server, multiple developers, 20+ microservices

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=dev-sql-server.domain.com;Database=Acontplus_Dev;user id=dev_user;pwd=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;Pooling=true;Max Pool Size=300;Min Pool Size=20;Connection Timeout=30;ConnectRetryCount=3;ConnectRetryInterval=10;Connection Lifetime=0;Command Timeout=60;Application Name=AcontPlus-Dev-{ServiceName};Packet Size=8192;"
  }
}
```

**Key Settings:**
- **Max Pool Size: 300** - Support for 20+ services × multiple devs
- **Min Pool Size: 20** - Higher baseline for consistent traffic
- **Encrypt: True** - SSL for network traffic
- **ConnectRetryCount: 3** - More retries for network issues
- **ConnectRetryInterval: 10s** - Longer interval for transient failures

---

### Staging Environment (Pre-Production)

**Scenario:** Production-like environment, performance testing, integration testing

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=staging-sql.domain.com;Database=Acontplus_Staging;user id=staging_user;pwd=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;Pooling=true;Max Pool Size=400;Min Pool Size=30;Connection Timeout=35;ConnectRetryCount=3;ConnectRetryInterval=10;Connection Lifetime=0;Command Timeout=75;Application Name=AcontPlus-Staging-{ServiceName};Packet Size=12288;"
  }
}
```

**Key Settings:**
- **Max Pool Size: 400** - Higher capacity for load testing
- **Min Pool Size: 30** - More pre-warmed connections
- **Connection Timeout: 35s** - Slightly longer for network latency
- **Command Timeout: 75s** - Allow longer-running test queries
- **Packet Size: 12KB** - Larger packets for bulk operations

---

### Production Environment (High-Volume)

**Scenario:** Production workload, 500+ concurrent users, high availability required

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-sql-cluster.domain.com;Database=Acontplus;user id=prod_user;pwd=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;Pooling=true;Max Pool Size=500;Min Pool Size=50;Connection Timeout=45;ConnectRetryCount=3;ConnectRetryInterval=10;Connection Lifetime=0;Command Timeout=90;Application Name=AcontPlus-PRD-{ServiceName};Load Balance Timeout=5;Packet Size=16384;"
  }
}
```

**Key Settings:**
- **Max Pool Size: 500** - Maximum capacity for production load
- **Min Pool Size: 50** - Large baseline for consistent performance
- **Connection Timeout: 45s** - Tolerant of network delays
- **Command Timeout: 90s** - Allow complex queries to complete
- **Load Balance Timeout: 5** - Connection load balancing
- **Packet Size: 16KB** - Maximum performance for large datasets

---

## 🚀 Critical Optimizations Applied

### 1. **MARS Removed** (MultipleActiveResultSets=false)

**Why:** MARS causes:
- Increased memory consumption
- Transaction deadlocks
- Connection pool exhaustion
- Complex debugging scenarios

**Solution:** Use multiple connections or async/await properly instead.

### 2. **Connection Pooling Optimized**

**Before:**
```
Max Pool Size=100 (default, insufficient)
Min Pool Size=0 (all connections created on-demand)
```

**After:**
```
Environment-specific pool sizes
Min Pool Size > 0 (pre-warmed connections)
```

**Benefits:**
- Faster response times (no connection creation delay)
- Predictable resource usage
- Better handling of traffic spikes

### 3. **Connection Resilience Added**

```
ConnectRetryCount=3
ConnectRetryInterval=10
```

**Benefits:**
- Auto-retry on transient network failures
- No manual retry logic needed in code
- Better reliability in cloud environments

### 4. **Granular Monitoring Enabled**

```
Application Name=AcontPlus-{Environment}-{ServiceName}
```

**Benefits:**
- Identify which service is causing issues
- Track connection usage per service
- Optimize per-service pool sizes

---

## 📊 Monitoring Connection Pools

### SQL Server Queries

#### Check Active Connections by Application

```sql
SELECT
    program_name AS ApplicationName,
    COUNT(*) AS ActiveConnections,
    DB_NAME(database_id) AS DatabaseName,
    login_name AS LoginName,
    host_name AS HostName
FROM sys.dm_exec_sessions
WHERE program_name LIKE 'AcontPlus%'
GROUP BY program_name, database_id, login_name, host_name
ORDER BY ActiveConnections DESC;
```

#### Monitor Connection Pool Exhaustion

```sql
SELECT
    program_name,
    COUNT(*) AS ConnectionCount,
    MAX(login_time) AS LastConnectionTime,
    status
FROM sys.dm_exec_sessions
WHERE program_name LIKE 'AcontPlus%'
GROUP BY program_name, status
HAVING COUNT(*) > 400; -- Alert if approaching Max Pool Size
```

#### Track Long-Running Queries

```sql
SELECT
    s.session_id,
    s.program_name,
    r.start_time,
    DATEDIFF(SECOND, r.start_time, GETDATE()) AS duration_seconds,
    DB_NAME(r.database_id) AS database_name,
    r.command,
    r.status,
    t.text AS query_text
FROM sys.dm_exec_requests r
INNER JOIN sys.dm_exec_sessions s ON r.session_id = s.session_id
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE s.program_name LIKE 'AcontPlus%'
    AND r.status = 'running'
    AND DATEDIFF(SECOND, r.start_time, GETDATE()) > 30 -- Queries running > 30s
ORDER BY duration_seconds DESC;
```

#### Memory Usage by Application

```sql
SELECT
    s.program_name,
    COUNT(*) AS session_count,
    SUM(r.granted_query_memory * 8 / 1024) AS total_memory_mb
FROM sys.dm_exec_sessions s
LEFT JOIN sys.dm_exec_requests r ON s.session_id = r.session_id
WHERE s.program_name LIKE 'AcontPlus%'
GROUP BY s.program_name
ORDER BY total_memory_mb DESC;
```

---

## ✅ Validation & Testing

### Pre-Deployment Checklist

- [ ] Verify MARS is **NOT** present in connection string
- [ ] Confirm `ConnectRetryCount=3` is set
- [ ] Confirm `ConnectRetryInterval=10` is set
- [ ] Verify `Application Name` includes service name
- [ ] Validate pool sizes match environment requirements
- [ ] Test connection string syntax with `SqlConnectionStringBuilder`

### Connection String Syntax Validator

```csharp
using Microsoft.Data.SqlClient;

public static bool ValidateConnectionString(string connectionString)
{
    try
    {
        var builder = new SqlConnectionStringBuilder(connectionString);

        // Verify MARS is NOT enabled
        if (builder.MultipleActiveResultSets)
        {
            Console.WriteLine("❌ ERROR: MARS is enabled - remove it!");
            return false;
        }

        // Verify pooling is enabled
        if (!builder.Pooling)
        {
            Console.WriteLine("⚠️  WARNING: Pooling is disabled!");
        }

        // Verify retry is configured
        if (builder.ConnectRetryCount < 3)
        {
            Console.WriteLine("⚠️  WARNING: ConnectRetryCount should be 3");
        }

        Console.WriteLine("✅ Connection string validation passed");
        Console.WriteLine($"   Server: {builder.DataSource}");
        Console.WriteLine($"   Database: {builder.InitialCatalog}");
        Console.WriteLine($"   Max Pool: {builder.MaxPoolSize}");
        Console.WriteLine($"   Min Pool: {builder.MinPoolSize}");
        Console.WriteLine($"   App Name: {builder.ApplicationName}");

        return true;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Invalid connection string: {ex.Message}");
        return false;
    }
}
```

### Load Testing

```csharp
public async Task SimulateConnectionPoolLoad(string connectionString, int concurrentConnections)
{
    var tasks = new List<Task>();

    for (int i = 0; i < concurrentConnections; i++)
    {
        tasks.Add(Task.Run(async () =>
        {
            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SELECT GETDATE()", connection);
            var result = await command.ExecuteScalarAsync();

            Console.WriteLine($"Connection {i}: {result}");
        }));
    }

    await Task.WhenAll(tasks);
}
```

---

## 🔐 Security Best Practices

### 1. **Never commit passwords to source control**

Use **User Secrets** (Development) or **Environment Variables** (Production):

```bash
# Set User Secret
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;pwd=SECRET;"

# Environment Variable (Production)
export ConnectionStrings__DefaultConnection="Server=...;pwd=SECRET;"
```

### 2. **Use Azure Key Vault for Production**

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{keyVaultName}.vault.azure.net/"),
    new DefaultAzureCredential());
```

### 3. **Enable SQL Server Encryption**

```
Encrypt=True;
TrustServerCertificate=False; // Use valid SSL certificate
```

---

## 📁 Related Files

- **Configuration:** `C:\Acontplus\Shared\sharedsettings.Development.json` (external shared config)
- **Service Configuration:** Individual service `appsettings.json` and `appsettings.Development.json`
- **User Secrets:** Per-service configuration via `dotnet user-secrets`
- **Script:** `scripts/Generate-ProductionAppSettings.ps1`
- **SQL Guide:** [SQL-Server-Naming-Convention.md](SQL-Server-Naming-Convention.md)

---

## 📚 Additional Resources

- [Microsoft: Connection Pooling](https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/sql-server-connection-pooling)
- [Microsoft: Connection Resiliency](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency)
- [SQL Server Best Practices](https://learn.microsoft.com/en-us/sql/relational-databases/policy-based-management/best-practices)

---

**Last Updated:** December 18, 2025
**Maintained by:** AcontPlus Development Team
