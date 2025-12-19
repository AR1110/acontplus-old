# Restaurant Statistics - Localization Guide

## Overview
Properties are in **English** for consistency, with **Spanish labels** provided via the `Labels` dictionary for UI/charts.

---

## DTO Property Names (English)

### Document Statistics
```csharp
public int TotalInvoices { get; set; }          // Facturas
public int TotalDeliveryNotes { get; set; }     // Notas de Entrega
public int TotalProformas { get; set; }         // Proformas
public int ProcessedDocuments { get; set; }     // Documentos Procesados
public int PendingDocuments { get; set; }       // Documentos Pendientes
public decimal DocumentProcessingRate { get; set; } // Tasa de Procesamiento
```

---

## Localization Approach

### 1. **Backend: English Properties**
```csharp
// C# DTOs use English
var stats = new DashboardStatsDto
{
    TotalInvoices = 150,
    TotalDeliveryNotes = 75,
    TotalProformas = 30,
    DocumentProcessingRate = 95.5m
};
```

### 2. **Service Layer: Automatic Label Injection**
```csharp
public async Task<Result<DashboardStatsDto, DomainError>> GetDashboardStatsAsync(
    FilterQuery filterQuery,
    CancellationToken cancellationToken = default)
{
    var result = await adoRepository.QuerySingleOrDefaultAsync<DashboardStatsDto>(...);

    // Auto-populate labels based on language parameter
    var language = filterQuery.Language ?? "es"; // Default Spanish
    result.Labels = StatisticsLocalization.GetDashboardLabels(language);

    return Result<DashboardStatsDto, DomainError>.Success(result);
}
```

### 3. **API Response: JSON with Labels**
```json
{
  "totalInvoices": 150,
  "totalDeliveryNotes": 75,
  "totalProformas": 30,
  "documentProcessingRate": 95.5,
  "labels": {
    "TotalInvoices": "Facturas",
    "TotalDeliveryNotes": "Notas de Entrega",
    "TotalProformas": "Proformas",
    "DocumentProcessingRate": "Tasa de Procesamiento (%)"
  }
}
```

### 4. **Frontend: Use Labels for Display**

#### Angular/TypeScript Example
```typescript
interface DashboardStats {
  totalInvoices: number;
  totalDeliveryNotes: number;
  totalProformas: number;
  documentProcessingRate: number;
  labels: Record<string, string>;
}

// Chart configuration
const chartData = {
  labels: ['Facturas', 'Notas de Entrega', 'Proformas'],
  datasets: [{
    label: stats.labels['DocumentProcessingRate'],
    data: [
      stats.totalInvoices,
      stats.totalDeliveryNotes,
      stats.totalProformas
    ]
  }]
};

// UI Display
<div class="stat-card">
  <label>{{ stats.labels['TotalInvoices'] }}</label>
  <span>{{ stats.totalInvoices }}</span>
</div>
```

#### Chart.js Example
```javascript
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: Object.keys(stats.labels).map(key => stats.labels[key]),
    datasets: [{
      data: [stats.totalInvoices, stats.totalDeliveryNotes, stats.totalProformas]
    }]
  },
  options: {
    plugins: {
      title: {
        text: stats.labels['DocumentProcessingRate']
      }
    }
  }
});
```

---

## Supported Languages

### Request with Language Parameter
```http
GET /api/statistics/dashboard?language=es
GET /api/statistics/dashboard?language=en
```

### FilterQuery Extension
```csharp
public class FilterQuery
{
    // Existing properties...
    public string? Language { get; set; } = "es"; // Default Spanish
}
```

---

## Adding New Languages

### 1. Update `StatisticsLocalization.cs`
```csharp
public static Dictionary<string, string> GetDashboardLabels(string language = "es")
{
    return language.ToLower() switch
    {
        "es" => new Dictionary<string, string>
        {
            ["TotalInvoices"] = "Facturas",
            ["TotalDeliveryNotes"] = "Notas de Entrega",
            // ...
        },
        "en" => new Dictionary<string, string>
        {
            ["TotalInvoices"] = "Invoices",
            ["TotalDeliveryNotes"] = "Delivery Notes",
            // ...
        },
        "pt" => new Dictionary<string, string> // Portuguese
        {
            ["TotalInvoices"] = "Faturas",
            ["TotalDeliveryNotes"] = "Notas de Entrega",
            // ...
        },
        _ => GetDashboardLabels("es") // Fallback to Spanish
    };
}
```

---

## Document Type Configuration

### Database Mapping (TipoDocumentoId)
```sql
-- Restaurant.OrderDocument.TipoDocumentoId values:
1 = Factura (Invoice to SRI)
2 = Nota de Entrega (Delivery Note)
3 = Proforma (Proforma Invoice)
4 = Nota de Crédito (Credit Note) -- Future
5 = Nota de Débito (Debit Note) -- Future
```

### Extending with More Document Types
```csharp
// Add to DashboardStatsDto
public int TotalCreditNotes { get; set; }
public int TotalDebitNotes { get; set; }

// Add to stored procedure DocumentStats CTE
COUNT(CASE WHEN doc.TipoDocumentoId = 4 THEN 1 END) AS TotalCreditNotes,
COUNT(CASE WHEN doc.TipoDocumentoId = 5 THEN 1 END) AS TotalDebitNotes,

// Add to localization
["TotalCreditNotes"] = "Notas de Crédito",
["TotalDebitNotes"] = "Notas de Débito",
```

---

## Best Practices

### ✅ DO
- Use English property names in C# DTOs
- Store translations in `StatisticsLocalization` helper
- Pass `language` parameter in API requests
- Use `Labels` dictionary for UI display
- Document Spanish equivalents in XML comments

### ❌ DON'T
- Mix Spanish/English in property names (`TotalFacturasSRI`)
- Hardcode labels in frontend
- Create separate DTOs per language
- Store translations in database (use resource files for larger apps)

---

## Migration Notes

### Old Approach (Removed)
```csharp
// ❌ Old: Spanish property names
public int TotalFacturasSRI { get; set; }
public int TotalNotasEntrega { get; set; }
```

### New Approach (Current)
```csharp
// ✅ New: English properties + Spanish labels
public int TotalInvoices { get; set; }
public Dictionary<string, string>? Labels { get; set; }

// Usage:
Labels["TotalInvoices"] // "Facturas"
```

---

## Example: Complete Angular Component

```typescript
import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './services/statistics.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="stats-grid">
      <div class="stat-card" *ngFor="let stat of documentStats">
        <h3>{{ stat.label }}</h3>
        <p class="value">{{ stat.value }}</p>
      </div>
    </div>
    <canvas id="documentChart"></canvas>
  `
})
export class DashboardComponent implements OnInit {
  documentStats: Array<{label: string, value: number}> = [];

  constructor(private statsService: StatisticsService) {}

  ngOnInit() {
    this.statsService.getDashboard({ language: 'es' }).subscribe(stats => {
      this.documentStats = [
        { label: stats.labels['TotalInvoices'], value: stats.totalInvoices },
        { label: stats.labels['TotalDeliveryNotes'], value: stats.totalDeliveryNotes },
        { label: stats.labels['TotalProformas'], value: stats.totalProformas }
      ];

      this.renderChart(stats);
    });
  }

  renderChart(stats: DashboardStats) {
    new Chart('documentChart', {
      type: 'doughnut',
      data: {
        labels: this.documentStats.map(s => s.label),
        datasets: [{
          data: this.documentStats.map(s => s.value),
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
        }]
      }
    });
  }
}
```

---

## Summary

✅ **English properties** for code consistency
✅ **Spanish labels** via `Labels` dictionary
✅ **Multi-language support** via language parameter
✅ **Chart-ready** labels for frontend libraries
✅ **Extensible** for new languages and document types
