# Statistics Localization Implementation Guide

> **Comprehensive guide for implementing multi-language support in statistics and analytics across AcontPlus services**

## 📋 Overview

AcontPlus uses **English property names** in DTOs with **localized labels** via dictionary injection for UI/charts. This approach:
- Maintains consistency in code (English)
- Supports multiple languages (Spanish, English, etc.)
- Centralizes translations for easy maintenance
- Works seamlessly with Angular frontend

## 🏗️ Architecture

### Property Names vs Labels

```csharp
// DTO Properties: ALWAYS English
public class DashboardStatsDto : BaseStatisticsDto
{
    public int TotalInvoices { get; set; }          // Property name
    public int TotalDeliveryNotes { get; set; }
    public decimal DocumentProcessingRate { get; set; }
}

// Labels: Localized via Dictionary
{
    "Labels": {
        "TotalInvoices": "Total de Facturas",       // Spanish
        "TotalDeliveryNotes": "Total de Notas de Entrega",
        "DocumentProcessingRate": "Tasa de Procesamiento"
    }
}
```

## 📁 Implementation Pattern

### File Location
```
src/Services/{ServiceName}/{ServiceName}.Application/Helpers/StatisticsLocalization.cs
```

**Examples:**
- `Restaurant.Application/Helpers/StatisticsLocalization.cs`
- `Sales.Application/Helpers/StatisticsLocalization.cs`
- `Inventory.Application/Helpers/StatisticsLocalization.cs`
- `Accounting.Application/Helpers/StatisticsLocalization.cs`

### Implementation Template

```csharp
namespace {ServiceName}.Application.Helpers;

/// <summary>
/// Provides localized labels for {ServiceName} statistics charts and UI components
/// Supports multiple languages with Spanish (ES) as default
/// </summary>
public static class StatisticsLocalization
{
    /// <summary>
    /// Gets localized labels for dashboard statistics
    /// </summary>
    /// <param name="language">ISO 639-1 language code (default: "es")</param>
    public static Dictionary<string, string> GetDashboardLabels(string language = "es")
    {
        return language.ToLower() switch
        {
            "es" => new Dictionary<string, string>
            {
                // ===== BASE ANALYTICS METRICS (from Acontplus.Analytics) =====
                ["TotalTransactions"] = "Total de Transacciones",
                ["CompletedTransactions"] = "Transacciones Completadas",
                ["CancelledTransactions"] = "Transacciones Canceladas",
                ["ActiveTransactions"] = "Transacciones Activas",
                ["TotalRevenue"] = "Ingresos Totales",
                ["AverageTransactionValue"] = "Valor Promedio",
                ["TransactionGrowthRate"] = "Tasa de Crecimiento",

                // ===== SERVICE-SPECIFIC METRICS =====
                ["TotalInvoices"] = "Total de Facturas",
                ["TotalDeliveryNotes"] = "Total de Notas de Entrega",
                ["ProcessedDocuments"] = "Documentos Procesados",
                ["PendingDocuments"] = "Documentos Pendientes",
                ["DocumentProcessingRate"] = "Tasa de Procesamiento",

                // Add more service-specific labels here...
            },

            "en" => new Dictionary<string, string>
            {
                // ===== BASE ANALYTICS METRICS =====
                ["TotalTransactions"] = "Total Transactions",
                ["CompletedTransactions"] = "Completed Transactions",
                ["CancelledTransactions"] = "Cancelled Transactions",
                ["ActiveTransactions"] = "Active Transactions",
                ["TotalRevenue"] = "Total Revenue",
                ["AverageTransactionValue"] = "Average Value",
                ["TransactionGrowthRate"] = "Growth Rate",

                // ===== SERVICE-SPECIFIC METRICS =====
                ["TotalInvoices"] = "Total Invoices",
                ["TotalDeliveryNotes"] = "Total Delivery Notes",
                ["ProcessedDocuments"] = "Processed Documents",
                ["PendingDocuments"] = "Pending Documents",
                ["DocumentProcessingRate"] = "Processing Rate",
            },

            _ => GetDashboardLabels("es") // Default to Spanish
        };
    }

    /// <summary>
    /// Gets localized labels for chart-specific statistics
    /// </summary>
    public static Dictionary<string, string> GetChartLabels(string language = "es")
    {
        return language.ToLower() switch
        {
            "es" => new Dictionary<string, string>
            {
                ["Date"] = "Fecha",
                ["Amount"] = "Monto",
                ["Count"] = "Cantidad",
                ["Percentage"] = "Porcentaje",
                ["Category"] = "Categoría",
                ["Total"] = "Total",
            },

            "en" => new Dictionary<string, string>
            {
                ["Date"] = "Date",
                ["Amount"] = "Amount",
                ["Count"] = "Count",
                ["Percentage"] = "Percentage",
                ["Category"] = "Category",
                ["Total"] = "Total",
            },

            _ => GetChartLabels("es")
        };
    }
}
```

## 🔧 Service Layer Integration

### Automatic Label Injection

```csharp
public class StatisticsService : IStatisticsService
{
    private readonly IAdoRepository adoRepository;

    public async Task<Result<DashboardStatsDto, DomainError>> GetDashboardStatsAsync(
        FilterQuery filterQuery,
        CancellationToken cancellationToken = default)
    {
        // 1. Execute query to get data
        var result = await adoRepository.QuerySingleOrDefaultAsync<DashboardStatsDto>(
            storedProcedure: "sp_GetDashboardStats",
            parameters: new { filterQuery.StartDate, filterQuery.EndDate },
            cancellationToken: cancellationToken);

        if (result == null)
            return Result<DashboardStatsDto, DomainError>.Failure(
                DomainError.NotFound("No statistics found"));

        // 2. Auto-populate labels based on language
        var language = filterQuery.Language ?? "es"; // Default to Spanish
        result.Labels = StatisticsLocalization.GetDashboardLabels(language);

        return Result<DashboardStatsDto, DomainError>.Success(result);
    }
}
```

## 📊 Base DTOs from Acontplus.Analytics

### Standard Properties (Always Include Labels)

```csharp
// Transaction Metrics
["TotalTransactions"] = "Total de Transacciones"
["CompletedTransactions"] = "Transacciones Completadas"
["CancelledTransactions"] = "Transacciones Canceladas"
["PendingTransactions"] = "Transacciones Pendientes"
["ActiveTransactions"] = "Transacciones Activas"

// Financial Metrics
["TotalRevenue"] = "Ingresos Totales"
["TotalCost"] = "Costo Total"
["NetProfit"] = "Ganancia Neta"
["GrossMargin"] = "Margen Bruto"
["AverageTransactionValue"] = "Valor Promedio por Transacción"

// Performance Metrics
["TransactionGrowthRate"] = "Tasa de Crecimiento"
["ConversionRate"] = "Tasa de Conversión"
["CancellationRate"] = "Tasa de Cancelación"

// Date Range
["StartDate"] = "Fecha Inicio"
["EndDate"] = "Fecha Fin"
["Period"] = "Período"
```

## 🌐 Frontend Integration (Angular)

### Using Labels in Charts

```typescript
// Component TypeScript
export class DashboardComponent implements OnInit {
  stats: DashboardStatsDto;

  ngOnInit() {
    this.statisticsService.getDashboardStats('es').subscribe(data => {
      this.stats = data;
      this.renderChart();
    });
  }

  renderChart() {
    const chartConfig = {
      labels: Object.keys(this.stats.labels),
      datasets: [{
        data: [
          this.stats.totalInvoices,
          this.stats.totalDeliveryNotes,
          this.stats.processedDocuments
        ],
        label: 'Documents'
      }]
    };
  }
}
```

### Using Labels in Templates

```html
<!-- Display with localized labels -->
<div class="stat-card">
  <h3>{{ stats.labels['TotalInvoices'] }}</h3>
  <p>{{ stats.totalInvoices }}</p>
</div>

<div class="stat-card">
  <h3>{{ stats.labels['DocumentProcessingRate'] }}</h3>
  <p>{{ stats.documentProcessingRate | percent }}</p>
</div>
```

## ✅ Best Practices

### 1. **Always Use English Property Names**
```csharp
// ✅ GOOD
public int TotalInvoices { get; set; }

// ❌ BAD
public int TotalFacturas { get; set; }
```

### 2. **Provide All Base Labels**
Every service MUST include labels for all `BaseStatisticsDto` properties:
```csharp
["TotalTransactions"] = "Total de Transacciones",
["CompletedTransactions"] = "Transacciones Completadas",
// ... etc
```

### 3. **Support Multiple Languages**
Minimum: Spanish (es) and English (en)
```csharp
return language.ToLower() switch
{
    "es" => spanishLabels,
    "en" => englishLabels,
    _ => spanishLabels // Default
};
```

### 4. **Consistent Naming Convention**
- Property: `TotalInvoices` (PascalCase, English)
- Label Key: `"TotalInvoices"` (matches property exactly)
- Label Value: `"Total de Facturas"` (localized)

### 5. **Document Service-Specific Properties**
Add comments to distinguish base vs custom properties:
```csharp
// ===== BASE ANALYTICS METRICS =====
["TotalTransactions"] = "Total de Transacciones",

// ===== RESTAURANT-SPECIFIC METRICS =====
["TotalMeals"] = "Total de Comidas",
["ActiveTables"] = "Mesas Activas",
```

## 🧪 Testing

### Unit Test Example

```csharp
[Fact]
public void GetDashboardLabels_Spanish_ReturnsCorrectLabels()
{
    // Arrange
    var language = "es";

    // Act
    var labels = StatisticsLocalization.GetDashboardLabels(language);

    // Assert
    Assert.NotNull(labels);
    Assert.Equal("Total de Facturas", labels["TotalInvoices"]);
    Assert.Equal("Tasa de Procesamiento", labels["DocumentProcessingRate"]);
}

[Fact]
public void GetDashboardLabels_English_ReturnsCorrectLabels()
{
    // Arrange
    var language = "en";

    // Act
    var labels = StatisticsLocalization.GetDashboardLabels(language);

    // Assert
    Assert.NotNull(labels);
    Assert.Equal("Total Invoices", labels["TotalInvoices"]);
    Assert.Equal("Processing Rate", labels["DocumentProcessingRate"]);
}
```

## 📚 Service-Specific Examples

### Restaurant Service
- File: `Restaurant.Application/Helpers/StatisticsLocalization.cs`
- Custom metrics: `TotalMeals`, `ActiveTables`, `DailyRevenue`
- See: [Restaurant Statistics Guide](../Restaurant/Statistics-Localization-Guide.md)

### Sales Service
- Custom metrics: `TotalOrders`, `PendingShipments`, `ReturnRate`

### Inventory Service
- Custom metrics: `StockLevel`, `LowStockItems`, `TurnoverRate`

### Accounting Service
- Custom metrics: `AccountsReceivable`, `AccountsPayable`, `CashFlow`

## 📖 Related Documentation

- [Base DTOs Business Validation](Base-DTOs-Business-Validation.md) - DTO validation patterns
- [Chart Labels Usage Guide](Chart-Labels-Usage-Guide.md) - Chart-specific labeling
- [Minimal API Statistics Pattern](../MINIMAL_API_STATISTICS_PATTERN.md) - API implementation

---

**Last Updated:** December 18, 2025
**Maintained by:** AcontPlus Development Team
