# StatisticsLocalization Implementation Guide

## Overview
Each service that uses `Acontplus.Analytics` base DTOs **MUST** implement its own `StatisticsLocalization` helper class to provide:
1. **Base property labels** (from Acontplus.Analytics DTOs)
2. **Service-specific property labels** (custom extensions)
3. **Multi-language support** (ES, EN, and others as needed)

---

## File Location Pattern
```
src/Services/{ServiceName}/{ServiceName}.Application/Helpers/StatisticsLocalization.cs
```

**Examples**:
- `Restaurant.Application/Helpers/StatisticsLocalization.cs` ✅
- `Sales.Application/Helpers/StatisticsLocalization.cs`
- `Inventory.Application/Helpers/StatisticsLocalization.cs`
- `Accounting.Application/Helpers/StatisticsLocalization.cs`

---

## Implementation Template

### Basic Structure
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
                // ===== BASE TRANSACTION METRICS (Universal - Copy from template) =====
                ["TotalTransactions"] = "Total de Transacciones",
                ["CompletedTransactions"] = "Transacciones Completadas",
                ["CancelledTransactions"] = "Transacciones Canceladas",
                ["ActiveTransactions"] = "Transacciones Activas",
                ["CompletionRate"] = "Tasa de Completitud (%)",
                ["AverageTransactionValue"] = "Valor Promedio por Transacción",

                // ===== BASE REVENUE METRICS (Universal - Copy from template) =====
                ["TotalRevenue"] = "Ingresos Totales",
                ["NetRevenue"] = "Ingresos Netos",
                ["TotalTax"] = "Total de Impuestos",
                ["TotalDiscounts"] = "Descuentos Totales",
                ["GrowthRate"] = "Tasa de Crecimiento (%)",
                ["RevenuePerEntity"] = "Ingresos por Entidad",

                // ===== BASE VOLUME METRICS (Universal - Copy from template) =====
                ["TotalItemsProcessed"] = "Total de Ítems Procesados",
                ["AverageItemsPerTransaction"] = "Ítems Promedio por Transacción",
                ["TopItem"] = "Ítem Más Popular",
                ["TopItemQuantity"] = "Cantidad del Más Popular",
                ["TopRevenueItem"] = "Ítem con Mayor Ingreso",
                ["TopRevenueItemTotal"] = "Ingreso del Top Ítem",

                // ===== BASE ENTITY METRICS (Universal - Copy from template) =====
                ["UniqueEntities"] = "Entidades Únicas",
                ["NewEntities"] = "Nuevas Entidades",
                ["ReturningEntities"] = "Entidades Recurrentes",
                ["EntityRetentionRate"] = "Tasa de Retención (%)",

                // ===== BASE PERIOD COMPARISON (Universal - Copy from template) =====
                ["RevenueChangePercent"] = "Cambio en Ingresos (%)",
                ["TransactionChangePercent"] = "Cambio en Transacciones (%)",
                ["EntityChangePercent"] = "Cambio en Entidades (%)",

                // ===== BASE FINANCIAL BREAKDOWN (Universal - Copy from template) =====
                ["CashPayments"] = "Pagos en Efectivo",
                ["CardPayments"] = "Pagos con Tarjeta",
                ["OtherPayments"] = "Otros Pagos",
                ["AverageDiscountPercent"] = "Descuento Promedio (%)",

                // ===== SERVICE-SPECIFIC PROPERTIES (Customize per service) =====
                ["CustomProperty1"] = "Etiqueta Personalizada 1",
                ["CustomProperty2"] = "Etiqueta Personalizada 2",
            },

            "en" => new Dictionary<string, string>
            {
                // ===== BASE TRANSACTION METRICS =====
                ["TotalTransactions"] = "Total Transactions",
                ["CompletedTransactions"] = "Completed Transactions",
                ["CancelledTransactions"] = "Cancelled Transactions",
                ["ActiveTransactions"] = "Active Transactions",
                ["CompletionRate"] = "Completion Rate (%)",
                ["AverageTransactionValue"] = "Average Transaction Value",

                // ===== BASE REVENUE METRICS =====
                ["TotalRevenue"] = "Total Revenue",
                ["NetRevenue"] = "Net Revenue",
                ["TotalTax"] = "Total Tax",
                ["TotalDiscounts"] = "Total Discounts",
                ["GrowthRate"] = "Growth Rate (%)",
                ["RevenuePerEntity"] = "Revenue per Entity",

                // ===== BASE VOLUME METRICS =====
                ["TotalItemsProcessed"] = "Total Items Processed",
                ["AverageItemsPerTransaction"] = "Average Items per Transaction",
                ["TopItem"] = "Top Item",
                ["TopItemQuantity"] = "Top Item Quantity",
                ["TopRevenueItem"] = "Top Revenue Item",
                ["TopRevenueItemTotal"] = "Top Revenue Item Total",

                // ===== BASE ENTITY METRICS =====
                ["UniqueEntities"] = "Unique Entities",
                ["NewEntities"] = "New Entities",
                ["ReturningEntities"] = "Returning Entities",
                ["EntityRetentionRate"] = "Entity Retention Rate (%)",

                // ===== BASE PERIOD COMPARISON =====
                ["RevenueChangePercent"] = "Revenue Change (%)",
                ["TransactionChangePercent"] = "Transaction Change (%)",
                ["EntityChangePercent"] = "Entity Change (%)",

                // ===== BASE FINANCIAL BREAKDOWN =====
                ["CashPayments"] = "Cash Payments",
                ["CardPayments"] = "Card Payments",
                ["OtherPayments"] = "Other Payments",
                ["AverageDiscountPercent"] = "Average Discount (%)",

                // ===== SERVICE-SPECIFIC PROPERTIES =====
                ["CustomProperty1"] = "Custom Label 1",
                ["CustomProperty2"] = "Custom Label 2",
            },

            _ => GetDashboardLabels("es") // Default to Spanish
        };
    }

    /// <summary>
    /// Gets localized labels for real-time statistics
    /// </summary>
    public static Dictionary<string, string> GetRealTimeLabels(string language = "es")
    {
        return language.ToLower() switch
        {
            "es" => new Dictionary<string, string>
            {
                // ===== BASE CURRENT ACTIVITY (Universal) =====
                ["ActiveOperations"] = "Operaciones Activas",
                ["OperationsLast5Min"] = "Operaciones (Últimos 5 min)",
                ["OperationsLast15Min"] = "Operaciones (Últimos 15 min)",
                ["OperationsThisHour"] = "Operaciones (Esta Hora)",

                // ===== BASE REVENUE TRACKING (Universal) =====
                ["CurrentHourRevenue"] = "Ingresos Hora Actual",
                ["TodayRevenue"] = "Ingresos Hoy",
                ["AverageTicketSize"] = "Ticket Promedio",

                // ===== BASE PROCESSING METRICS (Universal) =====
                ["ItemsInQueue"] = "Ítems en Cola",
                ["ItemsInProcess"] = "Ítems en Proceso",
                ["ItemsCompleted"] = "Ítems Completados",
                ["AverageProcessingTime"] = "Tiempo Promedio de Procesamiento (min)",
                ["OldestPendingMinutes"] = "Más Antiguo Pendiente (min)",
                ["DelayedOperations"] = "Operaciones Retrasadas",

                // ===== BASE PERFORMANCE (Universal) =====
                ["OperationsPerHour"] = "Operaciones por Hora",
                ["RevenuePerHour"] = "Ingresos por Hora",
                ["CurrentLoadStatus"] = "Estado de Carga Actual",

                // ===== BASE ALERTS (Universal) =====
                ["CriticalAlerts"] = "Alertas Críticas",
                ["WarningAlerts"] = "Alertas de Advertencia",

                // ===== BASE CAPACITY (Universal) =====
                ["TotalCapacity"] = "Capacidad Total",
                ["UsedCapacity"] = "Capacidad Usada",
                ["AvailableCapacity"] = "Capacidad Disponible",
                ["CapacityUtilizationRate"] = "Tasa de Utilización (%)",

                // ===== SERVICE-SPECIFIC PROPERTIES =====
                ["CustomRealtimeProperty1"] = "Propiedad Tiempo Real 1",
            },

            "en" => new Dictionary<string, string>
            {
                // ===== BASE CURRENT ACTIVITY =====
                ["ActiveOperations"] = "Active Operations",
                ["OperationsLast5Min"] = "Operations (Last 5 min)",
                ["OperationsLast15Min"] = "Operations (Last 15 min)",
                ["OperationsThisHour"] = "Operations (This Hour)",

                // ===== BASE REVENUE TRACKING =====
                ["CurrentHourRevenue"] = "Current Hour Revenue",
                ["TodayRevenue"] = "Today's Revenue",
                ["AverageTicketSize"] = "Average Ticket Size",

                // ===== BASE PROCESSING METRICS =====
                ["ItemsInQueue"] = "Items in Queue",
                ["ItemsInProcess"] = "Items in Process",
                ["ItemsCompleted"] = "Items Completed",
                ["AverageProcessingTime"] = "Average Processing Time (min)",
                ["OldestPendingMinutes"] = "Oldest Pending (min)",
                ["DelayedOperations"] = "Delayed Operations",

                // ===== BASE PERFORMANCE =====
                ["OperationsPerHour"] = "Operations per Hour",
                ["RevenuePerHour"] = "Revenue per Hour",
                ["CurrentLoadStatus"] = "Current Load Status",

                // ===== BASE ALERTS =====
                ["CriticalAlerts"] = "Critical Alerts",
                ["WarningAlerts"] = "Warning Alerts",

                // ===== BASE CAPACITY =====
                ["TotalCapacity"] = "Total Capacity",
                ["UsedCapacity"] = "Used Capacity",
                ["AvailableCapacity"] = "Available Capacity",
                ["CapacityUtilizationRate"] = "Capacity Utilization Rate (%)",

                // ===== SERVICE-SPECIFIC PROPERTIES =====
                ["CustomRealtimeProperty1"] = "Custom Realtime Property 1",
            },

            _ => GetRealTimeLabels("es")
        };
    }

    /// <summary>
    /// Gets localized chart type labels
    /// </summary>
    public static Dictionary<string, string> GetChartTypeLabels(string language = "es")
    {
        return language.ToLower() switch
        {
            "es" => new Dictionary<string, string>
            {
                ["line"] = "Línea",
                ["bar"] = "Barras",
                ["pie"] = "Circular",
                ["doughnut"] = "Dona",
                ["area"] = "Área",
                ["radar"] = "Radar",
                ["scatter"] = "Dispersión",
                ["bubble"] = "Burbuja",
                ["heatmap"] = "Mapa de Calor",
                ["gauge"] = "Indicador",
                ["funnel"] = "Embudo",
            },
            "en" => new Dictionary<string, string>
            {
                ["line"] = "Line",
                ["bar"] = "Bar",
                ["pie"] = "Pie",
                ["doughnut"] = "Doughnut",
                ["area"] = "Area",
                ["radar"] = "Radar",
                ["scatter"] = "Scatter",
                ["bubble"] = "Bubble",
                ["heatmap"] = "Heatmap",
                ["gauge"] = "Gauge",
                ["funnel"] = "Funnel",
            },
            _ => GetChartTypeLabels("es")
        };
    }
}
```

---

## Service-Specific Label Mapping

### 1. Sales Service
```csharp
// Sales.Application/Helpers/StatisticsLocalization.cs

// SERVICE-SPECIFIC PROPERTIES (Spanish)
["TotalQuotes"] = "Cotizaciones Totales",
["ConversionRate"] = "Tasa de Conversión (%)",
["AverageOrderValue"] = "Valor Promedio de Orden",
["TopSalesperson"] = "Mejor Vendedor",
["SalesByChannel"] = "Ventas por Canal",
["CrossSellRate"] = "Tasa de Venta Cruzada (%)",

// Entity Context: "Entity" = "Cliente" (Customer)
["RevenuePerEntity"] = "Ingresos por Cliente",
["UniqueEntities"] = "Clientes Únicos",
```

---

### 2. Inventory Service
```csharp
// Inventory.Application/Helpers/StatisticsLocalization.cs

// SERVICE-SPECIFIC PROPERTIES (Spanish)
["LowStockItems"] = "Ítems con Stock Bajo",
["OutOfStockItems"] = "Ítems Sin Stock",
["StockTurnoverRate"] = "Tasa de Rotación de Inventario",
["AverageStockAge"] = "Edad Promedio del Stock (días)",
["ReorderPointAlerts"] = "Alertas de Punto de Reorden",
["TotalStockValue"] = "Valor Total del Inventario",

// Entity Context: "Entity" = "Proveedor" (Supplier) or "Producto" (Product)
["UniqueEntities"] = "Productos Únicos",
["NewEntities"] = "Nuevos Productos",

// Transaction Context: "Transaction" = "Movimiento" (Movement)
["TotalTransactions"] = "Movimientos Totales",
["CompletedTransactions"] = "Movimientos Completados",
```

---

### 3. Accounting Service
```csharp
// Accounting.Application/Helpers/StatisticsLocalization.cs

// SERVICE-SPECIFIC PROPERTIES (Spanish)
["TotalInvoices"] = "Facturas Totales",
["PaidInvoices"] = "Facturas Pagadas",
["PendingInvoices"] = "Facturas Pendientes",
["OverdueInvoices"] = "Facturas Vencidas",
["AverageDaysToPayment"] = "Días Promedio para Pago",
["AccountsReceivable"] = "Cuentas por Cobrar",
["AccountsPayable"] = "Cuentas por Pagar",
["CashFlowRatio"] = "Ratio de Flujo de Caja",

// Entity Context: "Entity" = "Cliente" (Client)
["UniqueEntities"] = "Clientes Únicos",
["RevenuePerEntity"] = "Ingresos por Cliente",

// Transaction Context: "Transaction" = "Transacción Contable" (Accounting Entry)
["TotalTransactions"] = "Transacciones Contables",
```

---

### 4. Veterinary Service
```csharp
// Vet.Application/Helpers/StatisticsLocalization.cs

// SERVICE-SPECIFIC PROPERTIES (Spanish)
["TotalAppointments"] = "Citas Totales",
["CompletedCheckups"] = "Revisiones Completadas",
["VaccinationsAdministered"] = "Vacunas Aplicadas",
["SurgeriesPerformed"] = "Cirugías Realizadas",
["AverageConsultationTime"] = "Tiempo Promedio de Consulta (min)",
["EmergencyCases"] = "Casos de Emergencia",
["TotalPets"] = "Total de Mascotas",
["NewPetRegistrations"] = "Nuevas Mascotas Registradas",

// Entity Context: "Entity" = "Dueño de Mascota" (Pet Owner)
["UniqueEntities"] = "Dueños Únicos",
["NewEntities"] = "Nuevos Dueños",
["ReturningEntities"] = "Dueños Recurrentes",

// Transaction Context: "Transaction" = "Consulta/Cita" (Appointment)
["TotalTransactions"] = "Consultas Totales",
["ActiveTransactions"] = "Consultas Activas",
```

---

### 5. Mechanical/Auto Repair Service
```csharp
// Mechanical.Application/Helpers/StatisticsLocalization.cs

// SERVICE-SPECIFIC PROPERTIES (Spanish)
["TotalWorkOrders"] = "Órdenes de Trabajo Totales",
["CompletedRepairs"] = "Reparaciones Completadas",
["InProgressRepairs"] = "Reparaciones en Progreso",
["AverageRepairTime"] = "Tiempo Promedio de Reparación (hrs)",
["PartsRevenue"] = "Ingresos por Repuestos",
["LaborRevenue"] = "Ingresos por Mano de Obra",
["TotalServiceBays"] = "Bahías de Servicio Totales",
["OccupiedBays"] = "Bahías Ocupadas",

// Entity Context: "Entity" = "Propietario de Vehículo" (Vehicle Owner)
["UniqueEntities"] = "Propietarios Únicos",
["RevenuePerEntity"] = "Ingresos por Propietario",

// Transaction Context: "Transaction" = "Orden de Trabajo" (Work Order)
["TotalTransactions"] = "Órdenes de Trabajo",

// Capacity Context: "Capacity" = "Bahías" (Service Bays)
["TotalCapacity"] = "Bahías Totales",
["UsedCapacity"] = "Bahías Ocupadas",
```

---

### 6. Technical Support Service
```csharp
// TechnicalSupport.Application/Helpers/StatisticsLocalization.cs

// SERVICE-SPECIFIC PROPERTIES (Spanish)
["TotalTickets"] = "Tickets Totales",
["OpenTickets"] = "Tickets Abiertos",
["ResolvedTickets"] = "Tickets Resueltos",
["ClosedTickets"] = "Tickets Cerrados",
["AverageResolutionTime"] = "Tiempo Promedio de Resolución (hrs)",
["FirstResponseTime"] = "Tiempo de Primera Respuesta (min)",
["SLACompliance"] = "Cumplimiento SLA (%)",
["OverdueTickets"] = "Tickets Vencidos",
["EscalatedTickets"] = "Tickets Escalados",
["CustomerSatisfactionScore"] = "Puntuación de Satisfacción",

// Entity Context: "Entity" = "Cliente" (Customer/User)
["UniqueEntities"] = "Usuarios Únicos",

// Transaction Context: "Transaction" = "Ticket"
["TotalTransactions"] = "Tickets Totales",
["ActiveTransactions"] = "Tickets Activos",
["DelayedOperations"] = "Tickets con SLA Vencido",
```

---

### 7. BarberShop Service
```csharp
// BarberShop.Application/Helpers/StatisticsLocalization.cs

// SERVICE-SPECIFIC PROPERTIES (Spanish)
["TotalAppointments"] = "Citas Totales",
["CompletedServices"] = "Servicios Completados",
["WalkInClients"] = "Clientes sin Cita",
["ReservedAppointments"] = "Citas Reservadas",
["AverageServiceTime"] = "Tiempo Promedio de Servicio (min)",
["TotalBarbers"] = "Barberos Totales",
["ActiveBarbers"] = "Barberos Activos",
["RevenuePerBarber"] = "Ingresos por Barbero",
["ProductSalesRevenue"] = "Ingresos por Venta de Productos",

// Entity Context: "Entity" = "Cliente" (Client)
["UniqueEntities"] = "Clientes Únicos",
["ReturningEntities"] = "Clientes Recurrentes",

// Capacity Context: "Capacity" = "Sillas/Estaciones" (Chairs/Stations)
["TotalCapacity"] = "Estaciones Totales",
["UsedCapacity"] = "Estaciones Ocupadas",
```

---

## Usage in Service Layer

### Automatic Label Population
```csharp
// {Service}.Application/Services/StatisticsService.cs

public async Task<DashboardStatsDto> GetDashboardStatsAsync(
    StatisticsFilterQuery filterQuery,
    CancellationToken cancellationToken = default)
{
    var stats = await _repository.GetDashboardStatsAsync(filterQuery, cancellationToken);

    // Auto-populate Labels based on language
    var language = filterQuery.Language ?? "es";
    stats.Labels = StatisticsLocalization.GetDashboardLabels(language);

    return stats;
}

public async Task<List<AggregatedStatsDto>> GetAggregatedStatsAsync(
    StatisticsFilterQuery filterQuery,
    CancellationToken cancellationToken = default)
{
    var stats = await _repository.GetAggregatedStatsAsync(filterQuery, cancellationToken);

    // Populate Labels for each item in collection
    var language = filterQuery.Language ?? "es";
    var labels = StatisticsLocalization.GetDashboardLabels(language);

    foreach (var item in stats)
    {
        item.Labels = labels;
    }

    return stats;
}
```

---

## Frontend Usage Example

### Angular/TypeScript
```typescript
// chart.component.ts
interface DashboardStats {
  totalRevenue: number;
  totalTransactions: number;
  labels?: Record<string, string>;
}

createChart(stats: DashboardStats) {
  const labels = stats.labels || {};

  const chartConfig = {
    data: {
      labels: [
        labels['TotalRevenue'] || 'Total Revenue',
        labels['TotalTransactions'] || 'Total Transactions'
      ],
      datasets: [{
        data: [stats.totalRevenue, stats.totalTransactions]
      }]
    }
  };
}
```

---

## Complete Base Labels Reference

### BaseDashboardStatsDto (40 properties)
```csharp
// Transaction Metrics (6)
["TotalTransactions"]
["CompletedTransactions"]
["CancelledTransactions"]
["ActiveTransactions"]
["CompletionRate"]
["AverageTransactionValue"]

// Revenue Metrics (6)
["TotalRevenue"]
["NetRevenue"]
["TotalTax"]
["TotalDiscounts"]
["GrowthRate"]
["RevenuePerEntity"]

// Volume Metrics (6)
["TotalItemsProcessed"]
["AverageItemsPerTransaction"]
["TopItem"]
["TopItemQuantity"]
["TopRevenueItem"]
["TopRevenueItemTotal"]

// Entity Metrics (4)
["UniqueEntities"]
["NewEntities"]
["ReturningEntities"]
["EntityRetentionRate"]

// Period Comparison (3)
["RevenueChangePercent"]
["TransactionChangePercent"]
["EntityChangePercent"]

// Financial Breakdown (4)
["CashPayments"]
["CardPayments"]
["OtherPayments"]
["AverageDiscountPercent"]
```

### BaseRealTimeStatsDto (24 properties)
```csharp
// Current Activity (4)
["ActiveOperations"]
["OperationsLast5Min"]
["OperationsLast15Min"]
["OperationsThisHour"]

// Revenue Tracking (3)
["CurrentHourRevenue"]
["TodayRevenue"]
["AverageTicketSize"]

// Processing Metrics (6)
["ItemsInQueue"]
["ItemsInProcess"]
["ItemsCompleted"]
["AverageProcessingTime"]
["OldestPendingMinutes"]
["DelayedOperations"]

// Performance (3)
["OperationsPerHour"]
["RevenuePerHour"]
["CurrentLoadStatus"]

// Alerts (2)
["CriticalAlerts"]
["WarningAlerts"]

// Capacity (4)
["TotalCapacity"]
["UsedCapacity"]
["AvailableCapacity"]
["CapacityUtilizationRate"]
```

---

## Implementation Checklist

For each service implementing analytics:

- [ ] Create `{Service}.Application/Helpers/StatisticsLocalization.cs`
- [ ] Copy base labels template (40 Dashboard + 24 RealTime properties)
- [ ] Add service-specific custom property labels
- [ ] Implement Spanish (es) translations
- [ ] Implement English (en) translations
- [ ] Add additional languages if needed (pt, fr, etc.)
- [ ] Update `StatisticsService` to call `GetDashboardLabels(language)`
- [ ] Update `StatisticsService` to call `GetRealTimeLabels(language)`
- [ ] Populate Labels for collection results (Aggregated/Trends)
- [ ] Test with different language parameters
- [ ] Document entity mapping (Entity = Customer/Pet Owner/Supplier/etc.)
- [ ] Document transaction mapping (Transaction = Sale/Movement/Ticket/etc.)

---

## Benefits

✅ **Consistency**: All services use same base labels
✅ **Flexibility**: Each service adds domain-specific labels
✅ **Scalability**: Easy to add new languages without code changes
✅ **Type Safety**: Compile-time checking of property names
✅ **Maintainability**: Centralized label management per service
✅ **Frontend Agnostic**: Works with any UI framework (Angular, React, Vue)

---

## Anti-Patterns to Avoid

❌ **Hardcoded Labels in Frontend**
```typescript
// BAD
const label = 'Total Revenue';

// GOOD
const label = stats.labels?.['TotalRevenue'] || 'Total Revenue';
```

❌ **Missing Base Labels**
```csharp
// BAD - Only custom properties
["CustomProperty1"] = "Label 1"

// GOOD - Include ALL base properties + custom
["TotalRevenue"] = "Ingresos Totales",
["CustomProperty1"] = "Label 1"
```

❌ **Different Keys per Language**
```csharp
// BAD
"es": ["IngresosTotal"] = "..."
"en": ["TotalRevenue"] = "..."

// GOOD - Same keys, different values
"es": ["TotalRevenue"] = "Ingresos Totales"
"en": ["TotalRevenue"] = "Total Revenue"
```

---

## Next Steps

1. Copy `Restaurant.Application/Helpers/StatisticsLocalization.cs` to other services
2. Update service-specific sections for each domain
3. Test with API calls: `GET /api/statistics/dashboard?language=en`
4. Document entity/transaction mappings in each service's README
