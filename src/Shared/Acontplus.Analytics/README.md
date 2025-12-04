# Acontplus.Analytics - Universal Statistics Framework

## Overview

`Acontplus.Analytics` provides **cross-domain, reusable statistics DTOs and patterns** for building consistent analytics across all AcontPlus microservices. This framework eliminates code duplication and ensures uniform analytics APIs across Restaurant, Sales, Inventory, Accounting, and all other services.

## Core Philosophy

### Universal Business Metrics

Every business domain shares common patterns:
- **Transactions** (orders, sales, invoices, appointments, jobs)
- **Revenue** (gross, net, tax, discounts)
- **Entities** (customers, suppliers, patients, members)
- **Items** (products, services, articles, SKUs)
- **Time-series** (trends, forecasts, comparisons)

## Architecture

```
┌────────────────────────────────────────────────┐
│         Acontplus.Analytics                    │
│  (Shared Package - All Services)               │
├────────────────────────────────────────────────┤
│  Dtos/                                         │
│    ├─ BaseDashboardStatsDto.cs    (40 props)  │
│    ├─ BaseRealTimeStatsDto.cs     (24 props)  │
│    ├─ BaseAggregatedStatsDto.cs   (24 props)  │
│    └─ BaseTrendDto.cs             (38 props)  │
│  Interfaces/                                   │
│    └─ IStatisticsService<T1,T2,T3,T4>.cs      │
│  Models/                                       │
│    └─ StatsSqlTemplates.cs        (SQL Helpers)│
└────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  Service-Specific Implementation               │
│  (Restaurant, Sales, Inventory, etc.)          │
├────────────────────────────────────────────────┤
│  Option 1: Use Base DTOs As-Is                │
│    public class DashboardStatsDto :            │
│        BaseDashboardStatsDto                   │
│    { }                                         │
│                                                │
│  Option 2: Extend with Domain-Specific        │
│    public class RestaurantDashboardDto :       │
│        BaseDashboardStatsDto                   │
│    {                                           │
│        // Add restaurant-specific              │
│        public decimal TableTurnoverRate;       │
│        public int ActivePromotions;            │
│    }                                           │
└────────────────────────────────────────────────┘
```

## Base DTOs Deep Analysis

### 1. BaseDashboardStatsDto (40 properties)

**Universal Metrics** - Applicable to ALL business domains:

#### Transaction Metrics (6)
- `TotalTransactions` → Orders (Restaurant), Sales (Retail), Invoices (Accounting), Appointments (Vet), Jobs (Mechanical)
- `CompletedTransactions` → Finished orders, Paid invoices, Completed jobs
- `CancelledTransactions` → Voided, Rejected, Failed transactions
- `ActiveTransactions` → Pending, In-progress, Open
- `CompletionRate` → Success rate KPI
- `AverageTransactionValue` → AOV, Average ticket size

#### Revenue Metrics (7)
- `TotalRevenue` → Gross sales
- `NetRevenue` → After deductions
- `TotalTax` → VAT, Sales tax collected
- `TotalDiscounts` → Promotions, Markdowns
- `GrowthRate` → YoY, MoM, WoW growth
- `RevenuePerEntity` → Per customer, per client
- `AverageDiscountPercent` → Discount penetration

#### Volume Metrics (6)
- `TotalItemsProcessed` → Products sold, Services delivered
- `AverageItemsPerTransaction` → Basket size
- `TopItem` → Best seller name
- `TopItemQuantity` → Units of best seller
- `TopRevenueItem` → Highest revenue generator
- `TopRevenueItemTotal` → Revenue from top item

#### Entity Metrics (4)
- `UniqueEntities` → Unique customers, clients, suppliers
- `NewEntities` → First-time customers/clients
- `ReturningEntities` → Repeat business
- `EntityRetentionRate` → Loyalty metric

#### Comparison Metrics (3)
- `RevenueChangePercent` → vs previous period
- `TransactionChangePercent` → vs previous period
- `EntityChangePercent` → vs previous period

#### Payment Breakdown (4)
- `CashPayments` → Cash transactions
- `CardPayments` → Card/electronic
- `OtherPayments` → Credit, transfer, etc.

**Coverage**: ~85% of common dashboard metrics across all domains

---

### 2. BaseRealTimeStatsDto (24 properties)

**Live Operational Metrics** - For monitoring current activity:

#### Current Activity (4)
- `ActiveOperations` → Current pending/in-progress
- `OperationsLast5Min` → Recent velocity
- `OperationsLast15Min` → Short-term trend
- `OperationsThisHour` → Current hour tracking

#### Revenue Tracking (3)
- `CurrentHourRevenue` → Hourly sales
- `TodayRevenue` → Daily total
- `AverageTicketSize` → Current average

#### Processing Metrics (6)
- `ItemsInQueue` → Backlog
- `ItemsInProcess` → Being worked on
- `ItemsCompleted` → Finished/ready
- `AverageProcessingTime` → Throughput metric
- `OldestPendingMinutes` → Queue health
- `DelayedOperations` → SLA violations

#### Performance Indicators (3)
- `OperationsPerHour` → Throughput rate
- `RevenuePerHour` → Revenue velocity
- `CurrentLoadStatus` → Capacity classification

#### Alerts (2)
- `CriticalAlerts` → High priority
- `WarningAlerts` → Medium priority

#### Capacity Metrics (4)
- `TotalCapacity` → Max resources
- `UsedCapacity` → Currently utilized
- `AvailableCapacity` → Free resources
- `CapacityUtilizationRate` → % utilization

**Adaptability**:
- Restaurant: Tables = Capacity, Orders = Operations
- Mechanical: Bays = Capacity, Jobs = Operations
- Vet: Exam rooms = Capacity, Appointments = Operations
- Inventory: Warehouse space = Capacity, Movements = Operations

---

### 3. BaseAggregatedStatsDto (24 properties)

**Time-Series Aggregation** - For charts and trend visualization:

#### Time Dimension (3)
- `Period` → Timestamp for data point
- `PeriodLabel` → Display label
- `GroupBy` → Aggregation level (hour/day/week/month)

#### Metric Identification (3)
- `Metric` → What's being measured
- `Category` → Primary dimension
- `SubCategory` → Secondary dimension

#### Statistical Aggregates (6)
- `Value` → Primary metric
- `MinValue` → Minimum in period
- `MaxValue` → Maximum in period
- `AvgValue` → Average
- `Count` → Number of data points
- `Sum` → Total

#### Comparative Analysis (4)
- `PreviousPeriodValue` → Prior period value
- `ChangePercent` → % change
- `ChangeAbsolute` → Absolute change
- `Trend` → Direction indicator

#### Distribution Metrics (5)
- `Percentile25` → 1st quartile
- `Percentile50` → Median
- `Percentile75` → 3rd quartile
- `StandardDeviation` → Volatility
- `Variance` → Spread

**Use Cases**:
- Revenue by day/week/month charts
- Sales volume trends
- Customer acquisition over time
- Inventory turnover analysis
- Financial period comparisons

---

### 4. BaseTrendDto (38 properties)

**Comprehensive Trend Analysis** - For forecasting and pattern detection:

#### Time Series (6)
- `Date` → Data point timestamp
- `DateLabel` → Formatted display
- `DayOfWeek` → Seasonality analysis
- `Hour` → Intraday patterns
- `IsWeekend` → Weekend classification
- `IsHoliday` → Special day handling

#### Metric Data (3)
- `Metric` → What's being tracked
- `Value` → Actual value
- `Target` → Goal/benchmark
- `Forecast` → Predicted value

#### Moving Averages (3)
- `MovingAverage7` → Week smoothing
- `MovingAverage30` → Month smoothing
- `MovingAverage90` → Quarter smoothing

#### Trend Analysis (4)
- `ChangePercent` → Rate of change
- `ChangeAbsolute` → Absolute change
- `TrendDirection` → up/down/stable
- `Volatility` → Stability metric

#### Comparative Metrics (5)
- `SamePeriodLastWeek` → WoW comparison
- `SamePeriodLastMonth` → MoM comparison
- `SamePeriodLastYear` → YoY comparison
- `PeriodAverage` → Historical average
- `PercentOfPeriodAvg` → Relative performance

#### Classification (5)
- `Label` → Custom tag
- `Category` → Segment
- `IsAnomaly` → Outlier flag
- `AnomalyScore` → Anomaly confidence
- `Notes` → Contextual info

#### Metadata (1)
- `Metadata` → Flexible key-value storage

**Advanced Analytics Support**:
- Forecasting algorithms
- Seasonality detection
- Anomaly detection
- Pattern recognition
- What-if analysis

## Usage Examples

### Example 1: Restaurant Service (Current Implementation)

```csharp
// Extend base DTOs with domain-specific properties
public class RestaurantDashboardStatsDto : BaseDashboardStatsDto
{
    // Base provides: TotalTransactions, TotalRevenue, etc. (40 props)

    // Add restaurant-specific
    public decimal TableTurnoverRate { get; set; }
    public decimal AveragePreparationTime { get; set; }
    public int ActivePromotions { get; set; }
}

// Implement generic interface
public class StatisticsService :
    IStatisticsService<RestaurantDashboardStatsDto, RealTimeStatsDto, AggregatedStatsDto, TrendDto>
{
    // Implementation using IAdoRepository
}
```

### Example 2: Sales Service (Simplified)

```csharp
// Use base DTOs as-is - no extension needed!
public class StatisticsService :
    IStatisticsService<BaseDashboardStatsDto, BaseRealTimeStatsDto, BaseAggregatedStatsDto, BaseTrendDto>
{
    private const string ModuleName = "Sales.Statistics";

    public async Task<Result<BaseDashboardStatsDto, DomainError>> GetDashboardStatsAsync(
        FilterQuery filterQuery,
        CancellationToken cancellationToken = default)
    {
        var parameters = filterQuery.Adapt<Dictionary<string, object>>();
        var result = await _adoRepository.QuerySingleOrDefaultAsync<BaseDashboardStatsDto>(
            $"{ModuleName}GetDashboard", parameters, new CommandOptionsDto { CommandTimeout = 30 }
        );
        // ... error handling
    }
}
```

### Example 3: Inventory Service (Capacity-Focused)

```csharp
public class InventoryRealTimeStatsDto : BaseRealTimeStatsDto
{
    // Base provides: OperationsThisHour, CapacityUtilizationRate, etc.

    // Add inventory-specific
    public int LowStockItems { get; set; }
    public int OutOfStockItems { get; set; }
    public decimal WarehouseOccupancyPercent { get; set; }
}
```

## SQL Stored Procedure Templates

### Using StatsSqlTemplates

```sql
-- Example: Generic Dashboard Procedure
CREATE OR ALTER PROCEDURE {Schema}.StatisticsGetDashboard
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Use template defaults
    SET @StartDate = ISNULL(@StartDate, DATEADD(DAY, -30, GETUTCDATE()));
    SET @EndDate = ISNULL(@EndDate, GETUTCDATE());

    -- Calculate previous period
    DECLARE @PeriodDays INT = DATEDIFF(DAY, @StartDate, @EndDate);
    DECLARE @PrevStartDate DATETIME2 = DATEADD(DAY, -@PeriodDays, @StartDate);
    DECLARE @PrevEndDate DATETIME2 = @StartDate;

    SELECT
        -- Map domain tables to universal fields
        COUNT(t.Id) AS TotalTransactions,          -- Your Orders/Sales/Invoices table
        COUNT(CASE WHEN t.Status = 'Completed' THEN 1 END) AS CompletedTransactions,
        COUNT(CASE WHEN t.Status = 'Cancelled' THEN 1 END) AS CancelledTransactions,
        SUM(t.Total) AS TotalRevenue,
        SUM(t.Tax) AS TotalTax,
        SUM(t.Discount) AS TotalDiscounts,
        AVG(t.Total) AS AverageTransactionValue,
        COUNT(DISTINCT t.CustomerId) AS UniqueEntities,
        SUM(td.Quantity) AS TotalItemsProcessed,
        -- ... map all 40 base properties

    FROM {YourSchema}.{TransactionTable} t
    LEFT JOIN {YourSchema}.{DetailTable} td ON t.Id = td.TransactionId
    WHERE t.CreatedAt BETWEEN @StartDate AND @EndDate
        AND t.IsDeleted = 0;
END;
```

## Domain Mapping Guide

| Base Property | Restaurant | Sales | Inventory | Accounting | Vet |
|--------------|------------|-------|-----------|------------|-----|
| TotalTransactions | Orders | Sales | Movements | Invoices | Appointments |
| UniqueEntities | Customers | Customers | Suppliers | Clients | Patients |
| TotalItemsProcessed | Menu items | Products | Stock items | Line items | Services |
| TotalCapacity | Tables | POS terminals | Warehouse space | Staff capacity | Exam rooms |
| ItemsInQueue | Pending orders | Pending sales | Pending receipts | Pending invoices | Waiting patients |

## Benefits

### ✅ Code Reuse
- **40+ universal properties** eliminate 90% of DTO boilerplate
- **Generic interface** ensures API consistency
- **SQL templates** accelerate stored procedure development

### ✅ Consistency
- Same property names across all services
- Uniform API responses for frontend
- Standardized analytics patterns

### ✅ Maintainability
- Update base DTOs → All services benefit
- Single source of truth for analytics structure
- Reduced testing surface

### ✅ Extensibility
- Inherit base DTOs → Add domain-specific properties
- Or use base DTOs as-is for quick implementation
- Flexible for simple and complex scenarios

### ✅ Frontend Integration
- TypeScript can generate from base DTOs
- Same chart components across all modules
- Unified dashboard framework

## Migration Path for Restaurant Service

1. **Add package reference**:
```xml
<PackageReference Include="Acontplus.Analytics" />
```

2. **Update DTOs to inherit**:
```csharp
public class DashboardStatsDto : BaseDashboardStatsDto
{
    // Keep restaurant-specific properties only
    // Remove duplicates that exist in base
}
```

3. **Update stored procedures** to return base property names

4. **Test** - All existing APIs continue to work

## Performance Considerations

- **Base DTOs are lightweight** - Only properties, no logic
- **Generic interface** compiles to concrete types (no reflection)
- **SQL templates** are compile-time strings (no runtime overhead)
- **FilterQuery** already used across the platform

## Next Steps

1. ✅ Create `Acontplus.Analytics` package
2. ⏳ Migrate Restaurant service to use base DTOs
3. ⏳ Implement in Sales service (showcase simplicity)
4. ⏳ Roll out to Inventory, Accounting, Vet, etc.
5. ⏳ Generate TypeScript definitions for frontend
6. ⏳ Build universal analytics dashboard component

---

**Version**: 1.0.0
**Package**: `Acontplus.Analytics`
**Target**: .NET 10.0
**Dependencies**: `Acontplus.Utilities`
