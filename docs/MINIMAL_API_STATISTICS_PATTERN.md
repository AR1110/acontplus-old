# Minimal API Statistics Pattern

## Overview

This document describes the **minimal API statistics pattern** implemented for high-performance analytics endpoints across AcontPlus microservices. This pattern provides a clean, maintainable approach for statistics APIs with optimal performance using direct ADO.NET and built-in caching.

## Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│           API Layer (*.Api)                 │
│  - StatisticsEndpoints.cs                   │
│  - Minimal API endpoint handlers            │
│  - Caching configuration                    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Application Layer (*.Application)      │
│  - Interfaces/IStatisticsService.cs         │
│  - Services/StatsService.cs                 │
│  - Dtos/Statistics/                         │
│    - Request DTOs (DateRangeRequest, etc.)  │
│    - Response DTOs (DashboardStatsDto, etc.)│
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│    Infrastructure Layer (*.Infrastructure)  │
│  - IAdoRepository (Acontplus.Persistence)   │
│  - SQL stored procedure execution via UoW   │
└─────────────────────────────────────────────┘
```

## Implementation Guide

### 1. Create DTOs (Application Layer)

Create request and response DTOs in `{Service}.Application/Dtos/Statistics/`:

**Request DTOs:**
- `DateRangeRequest.cs` - Base request with start/end dates
- `AggregationRequest.cs` - Request with grouping options

**Response DTOs:**
- `DashboardStatsDto.cs` - Dashboard metrics
- `RealTimeStatsDto.cs` - Real-time metrics
- `AggregatedStatsDto.cs` - Aggregated data
- `TrendDto.cs` - Time-series trends

### 2. Create Service Interface (Application Layer)

Create `IStatisticsService.cs` in `{Service}.Application/Interfaces/`:

```csharp
public interface IStatisticsService
{
    Task<Result<DashboardStatsDto, DomainError>> GetDashboardStatsAsync(DateRangeRequest request, CancellationToken ct = default);
    Task<Result<RealTimeStatsDto, DomainError>> GetRealTimeStatsAsync(CancellationToken ct = default);
    Task<Result<List<AggregatedStatsDto>, DomainError>> GetAggregatedStatsAsync(AggregationRequest request, CancellationToken ct = default);
    Task<Result<List<TrendDto>, DomainError>> GetTrendsAsync(string metric, DateRangeRequest request, CancellationToken ct = default);
}
```

### 3. Implement Service (Application Layer)

Create or update `StatsService.cs` in `{Service}.Application/Services/`:

**Key Features:**
- Uses `IAdoRepository` from Acontplus.Persistence.SqlServer
- **Result<T, DomainError> pattern** for consistent error handling
- 30-second command timeout
- Comprehensive error handling with typed errors
- Follows existing service patterns in the codebase

```csharp
public class StatsService(IAdoRepository adoRepository) : IStatisticsService
{
    private const string ModuleName = "{Schema}.Stats_";

    public async Task<Result<DashboardStatsDto, DomainError>> GetDashboardStatsAsync(
        DateRangeRequest request, CancellationToken ct = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "StartDate", request.EffectiveStartDate },
                { "EndDate", request.EffectiveEndDate }
            };
            var commandOptions = new CommandOptionsDto { CommandTimeout = 30 };

            var result = await adoRepository.QuerySingleOrDefaultAsync<DashboardStatsDto>(
                $"{ModuleName}GetDashboard", parameters, commandOptions);

            if (result == null)
            {
                var error = DomainError.NotFound("DASHBOARD_STATS_NOT_FOUND",
                    "No dashboard statistics were found.");
                return Result<DashboardStatsDto, DomainError>.Failure(error);
            }

            return Result<DashboardStatsDto, DomainError>.Success(result);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("DASHBOARD_STATS_ERROR", ex.Message);
            return Result<DashboardStatsDto, DomainError>.Failure(error);
        }
    }
    // ... other methods
}
```

### 4. Create Endpoints (API Layer)

Create `StatisticsEndpoints.cs` in `{Service}.Api/Endpoints/`:

**Endpoint Pattern:**
```csharp
public static void MapStatisticsEndpoints(this IEndpointRouteBuilder app)
{
    var group = app.MapGroup("/api/statistics")
        .RequireAuthorization()
        .WithTags("Statistics");

    group.MapGet("/dashboard", GetDashboardStats)
        .WithName("GetDashboardStats")
        .Produces<DashboardStatsDto>(StatusCodes.Status200OK);
}
```

**Handler Pattern:**
```csharp
private static async Task<IResult> GetDashboardStats(
    [AsParameters] DateRangeRequest request,
    IStatisticsService service,
    CancellationToken cancellationToken)
{
    return await service.GetDashboardStatsAsync(request, cancellationToken)
        .ToGetMinimalApiResultAsync();
}
```

**Note**: The `ToGetMinimalApiResultAsync()` extension method automatically:
- Converts `Result<T, DomainError>` to appropriate HTTP responses
- Maps domain errors to HTTP status codes (404, 400, 500, etc.)
- Provides consistent error formatting across all endpoints### 5. Register Services (Application Layer DI)

Services are automatically registered via Scrutor assembly scanning in `ApplicationServicesExtensions.cs`:

```csharp
string[] scopedNameSpaces =
[
    "{Service}.Application.Services",
    "Acontplus.Persistence.SqlServer.Repositories",
    // ... other namespaces
];

services.Scan(scan => scan
    .FromAssembliesOf(scopedNameSpaces.Select(ns => Type.GetType($"{ns}.Dummy") ?? typeof(object)).ToArray())
    .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
    .AsImplementedInterfaces()
    .WithScopedLifetime());
```

**Note**: No manual registration needed - Scrutor will discover `IStatisticsService` and `StatsService`.**Endpoint Registration (`{Service}.Api/Endpoints/RegisterEndpoints.cs`):**
```csharp
app.MapStatisticsEndpoints();
```

### 6. Create SQL Stored Procedures

Create stored procedures in `database/{ServiceName}/Stats_StoredProcedures.sql`:

**Naming Convention:**
- `{Schema}.Stats_GetDashboard`
- `{Schema}.Stats_GetRealTime`
- `{Schema}.Stats_GetAggregated`
- `{Schema}.Stats_GetTrends`

## Key Benefits

### ✅ Performance
- **IAdoRepository from Acontplus** - Uses proven infrastructure
- **Stored procedures** - Optimized execution plans
- **Output caching** - Reduces database load
- **Async/await** - Non-blocking I/O

### ✅ Maintainability
- **Clean Architecture** - Clear separation of concerns
- **Service-based pattern** - Consistent with existing services
- **Type-safe DTOs** - Compile-time validation
- **Minimal API** - Simple, readable code
- **Consistent pattern** - Easy to replicate

### ✅ Scalability
- **Stateless** - Horizontal scaling ready
- **Caching** - Configurable TTL per endpoint
- **Connection pooling** - Automatic with ADO.NET via UoW
- **Cancellation tokens** - Graceful shutdown support

## Caching Strategy

### Cache Key Format
```
{endpoint}_{param1}_{param2}_{...}
```

### TTL Recommendations
- **Dashboard stats**: 5 minutes
- **Real-time stats**: No cache (always fresh)
- **Aggregated stats**: 3-5 minutes
- **Trends**: 5-10 minutes

### Cache Invalidation
For write operations that affect statistics:
```csharp
cache.Remove("dashboard_*"); // Consider using cache tags/groups
```

## Endpoint Examples

### 1. Dashboard Statistics
```http
GET /api/statistics/dashboard?StartDate=2025-01-01&EndDate=2025-01-31
Authorization: Bearer {token}
```

**Response:**
```json
{
  "totalOrders": 1250,
  "activeOrders": 45,
  "totalRevenue": 125000.50,
  "averageOrderValue": 100.00,
  "growthRate": 15.5,
  "totalItemsSold": 3200,
  "uniqueCustomers": 890,
  "mostPopularItem": "Combo Meal #1"
}
```

### 2. Real-time Statistics
```http
GET /api/statistics/real-time
Authorization: Bearer {token}
```

**Response:**
```json
{
  "activeTables": 12,
  "recentOrders": 8,
  "averagePreparationTime": 15.5,
  "pendingOrders": 5,
  "inPreparationOrders": 7,
  "currentHourRevenue": 2500.00,
  "activePromotions": 3
}
```

### 3. Trends
```http
GET /api/statistics/trends/revenue?StartDate=2025-01-01&EndDate=2025-01-31
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "date": "2025-01-01",
    "value": 4500.00,
    "metric": "revenue",
    "changePercent": null,
    "label": null
  },
  {
    "date": "2025-01-02",
    "value": 5200.00,
    "metric": "revenue",
    "changePercent": null,
    "label": null
  }
]
```

## Performance Considerations

### Database Optimization
1. **Indexes**: Create on frequently queried columns (CreatedDate, StatusId, etc.)
2. **Statistics**: Keep SQL Server statistics updated
3. **Execution Plans**: Review and optimize stored procedures
4. **Partitioning**: Consider for large historical data

### Query Optimization
1. **Filter early**: Use WHERE clauses in stored procedures
2. **Limit results**: Use TOP or pagination for large datasets
3. **Avoid N+1**: Use JOINs instead of multiple queries
4. **Computed columns**: Pre-calculate complex aggregations

### Caching Optimization
1. **TTL tuning**: Balance freshness vs performance
2. **Memory management**: Monitor cache size
3. **Distributed cache**: Consider Redis for multi-instance deployments
4. **Cache warming**: Pre-populate frequently accessed data

## Testing

### Unit Tests
```csharp
[Fact]
public async Task GetDashboardStatsAsync_ReturnsValidData()
{
    // Arrange
    var mockRepo = new Mock<IAdoRepository>();
    mockRepo.Setup(x => x.QuerySingleOrDefaultAsync<DashboardStatsDto>(
        It.IsAny<string>(),
        It.IsAny<Dictionary<string, object>>(),
        It.IsAny<CommandOptionsDto>()))
        .ReturnsAsync(new DashboardStatsDto { TotalOrders = 100 });

    var service = new StatsService(mockRepo.Object);

    // Act
    var result = await service.GetDashboardStatsAsync(
        new DateRangeRequest { StartDate = DateTime.UtcNow.AddDays(-30), EndDate = DateTime.UtcNow }
    );

    // Assert
    Assert.NotNull(result);
    Assert.Equal(100, result.TotalOrders);
}
```### Integration Tests
```csharp
[Fact]
public async Task GetDashboardStats_ReturnsCachedResult()
{
    // Test caching behavior
}
```

## Migration to Other Services

### Step-by-Step Process

1. **Copy DTOs** from `Restaurant.Application/Dtos/Statistics/` to `{Service}.Application/Dtos/Statistics/`
2. **Copy Interface** from `Restaurant.Application/Interfaces/IStatisticsService.cs` to `{Service}.Application/Interfaces/`
3. **Update Service** - Add methods to existing `StatsService.cs` or create new one in `{Service}.Application/Services/`
4. **Copy Endpoints** from `Restaurant.Api/Endpoints/StatisticsEndpoints.cs` to `{Service}.Api/Endpoints/`
5. **Update namespaces** to match target service
6. **Update stored procedure names** to match service schema
7. **Register endpoints** in RegisterEndpoints.cs
8. **Create stored procedures** in database
9. **Test endpoints**

### Checklist
- [ ] DTOs created and namespaces updated
- [ ] Service interface in Application/Interfaces
- [ ] Service implementation in Application/Services
- [ ] Endpoints created with proper authorization
- [ ] Endpoints registered in RegisterEndpoints
- [ ] Stored procedures created in database
- [ ] Integration tests written
- [ ] API documentation updated

## Service-Specific Examples

### Restaurant Service ✅ (Reference Implementation)
- Location: `src/Services/Restaurant/`
- Schema: `Restaurant`
- Endpoints: 4 (Dashboard, Real-time, Aggregated, Trends)

### Sales Service (To Be Implemented)
- Location: `src/Services/Sales/`
- Schema: `Ventas` (Spanish name in DB)
- Suggested metrics: Sales volume, product performance, customer analytics

### Inventory Service (To Be Implemented)
- Location: `src/Services/Inventory/`
- Schema: `Inventario` (Spanish name in DB)
- Suggested metrics: Stock levels, turnover rate, reorder alerts

### Accounting Service (To Be Implemented)
- Location: `src/Services/Accounting/`
- Schema: `Contabilidad` (Spanish name in DB)
- Suggested metrics: Financial summaries, expense analysis, budget tracking

## Best Practices

### 1. Naming Conventions
- **DTOs**: `{Purpose}StatsDto` or `{Purpose}Request`
- **Stored Procedures**: `{Schema}.Stats_{Action}`
- **Endpoints**: `/api/statistics/{metric}`
- **Cache Keys**: `{endpoint}_{params}`

### 2. Error Handling
- Log all SQL exceptions with context
- Return appropriate HTTP status codes
- Provide meaningful error messages
- Don't expose database details to clients

### 3. Security
- Always require authorization
- Validate input parameters
- Use parameterized queries (via stored procedures)
- Implement rate limiting for expensive queries

### 4. Monitoring
- Track endpoint response times
- Monitor cache hit rates
- Alert on high database query times
- Log slow queries for optimization

## Troubleshooting

### Common Issues

**Issue**: `ConnectionString not configured`
- **Solution**: Ensure `DefaultConnection` exists in appsettings.json or user secrets

**Issue**: `Stored procedure not found`
- **Solution**: Verify stored procedure name matches exactly (schema + name)

**Issue**: `Mapping failed - column not found`
- **Solution**: Ensure DTO property names match stored procedure column names (case-insensitive)

**Issue**: `Cache not working`
- **Solution**: Verify `AddCachingServices` or `AddMemoryCache` is registered in DI

## Additional Resources

- [ASP.NET Core Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [ADO.NET Performance Best Practices](https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/ado-net-performance)
- [Memory Caching in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/memory)
- [SQL Server Stored Procedure Best Practices](https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine)

## Version History

- **v1.0** (2025-12-04): Initial implementation in Restaurant service
  - 4 core endpoints (Dashboard, Real-time, Aggregated, Trends)
  - ADO.NET-based repository pattern
  - In-memory caching with configurable TTL
  - Comprehensive documentation and SQL templates

---

**Maintained by**: AcontPlus Development Team
**Last Updated**: 2025-12-04
**Status**: ✅ Production Ready
