# Chart Labels Usage Guide

## Overview
Chart metadata (titles, subtitles, axis labels, legends, tooltips) is included in the `Labels` dictionary returned by all statistics endpoints. This guide shows how to use them in the frontend.

---

## Pattern Convention

### Label Key Structure
```
Chart.{Category}.{Name}
```

**Categories**:
- `Chart.Title.*` - Chart titles
- `Chart.Subtitle.*` - Chart subtitles
- `Chart.Axis.*` - X/Y axis labels
- `Chart.Legend.*` - Legend labels
- `Chart.Tooltip.*` - Tooltip labels
- `Chart.Status.*` - Status labels
- `Chart.Alert.*` - Alert levels

**Examples**:
```typescript
labels['Chart.Title.Revenue']        // "Ingresos y Ventas" (ES) / "Revenue and Sales" (EN)
labels['Chart.Axis.Revenue']         // "Ingresos ($)" / "Revenue ($)"
labels['Chart.Legend.Actual']        // "Real" / "Actual"
labels['Chart.Tooltip.ComparedTo']   // "comparado con" / "compared to"
```

---

## Frontend Implementation

### 1. Angular + Chart.js

#### Dashboard Revenue Chart
```typescript
// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

export class DashboardComponent implements OnInit {
  stats: DashboardStatsDto;

  ngOnInit() {
    this.statisticsService.getDashboardStats('es').subscribe(stats => {
      this.stats = stats;
      this.createRevenueChart(stats);
    });
  }

  createRevenueChart(stats: DashboardStatsDto) {
    const labels = stats.labels || {};

    new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: [
          labels['TotalRevenue'] || 'Total Revenue',
          labels['NetRevenue'] || 'Net Revenue',
          labels['TotalTax'] || 'Tax'
        ],
        datasets: [{
          label: labels['Chart.Legend.Actual'] || 'Actual',
          data: [stats.totalRevenue, stats.netRevenue, stats.totalTax],
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: labels['Chart.Title.Revenue'] || 'Revenue and Sales',
            font: { size: 18 }
          },
          subtitle: {
            display: true,
            text: labels['Chart.Subtitle.Revenue'] || 'Revenue analysis and growth'
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: labels['Chart.Axis.Revenue'] || 'Revenue ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: labels['Chart.Axis.Count'] || 'Metrics'
            }
          }
        }
      }
    });
  }
}
```

---

### 2. Trend Chart with Time Series

#### Orders Trend (Line Chart)
```typescript
// trends.component.ts
export class TrendsComponent implements OnInit {
  createTrendChart(trends: TrendDto[]) {
    const labels = trends[0]?.labels || {};

    new Chart('trendChart', {
      type: 'line',
      data: {
        labels: trends.map(t => t.dateLabel),
        datasets: [
          {
            label: labels['Chart.Legend.Actual'] || 'Actual',
            data: trends.map(t => t.value),
            borderColor: '#2196F3',
            tension: 0.4
          },
          {
            label: labels['Chart.Legend.Target'] || 'Target',
            data: trends.map(t => t.target),
            borderColor: '#FF9800',
            borderDash: [5, 5]
          },
          {
            label: labels['Chart.Legend.Forecast'] || 'Forecast',
            data: trends.map(t => t.forecast),
            borderColor: '#9C27B0',
            borderDash: [10, 5]
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: labels['Chart.Title.Orders'] || 'Orders and Transactions'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                const change = trends[context.dataIndex].changePercent;
                const changeLabel = change >= 0
                  ? labels['Chart.Tooltip.Increase'] || 'Increase'
                  : labels['Chart.Tooltip.Decrease'] || 'Decrease';

                return `${context.dataset.label}: ${value} (${changeLabel}: ${Math.abs(change)}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: labels['Chart.Axis.Date'] || 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: labels['Chart.Axis.Orders'] || 'Order Count'
            }
          }
        }
      }
    });
  }
}
```

---

### 3. Real-Time Dashboard (Gauge Chart)

#### Table Occupancy Gauge
```typescript
// realtime-dashboard.component.ts
export class RealtimeDashboardComponent implements OnInit {
  createOccupancyGauge(stats: RealTimeStatsDto) {
    const labels = stats.labels || {};

    new Chart('occupancyGauge', {
      type: 'doughnut',
      data: {
        labels: [
          labels['UsedCapacity'] || 'Occupied',
          labels['AvailableCapacity'] || 'Available'
        ],
        datasets: [{
          data: [stats.usedCapacity, stats.availableCapacity],
          backgroundColor: ['#F44336', '#4CAF50'],
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: labels['Chart.Title.TableStatus'] || 'Table Status'
          },
          subtitle: {
            display: true,
            text: labels['Chart.Subtitle.RealTime'] || 'Updates every 30 seconds'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = stats.totalCapacity;
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}
```

---

### 4. ApexCharts Example

#### Mixed Chart (Bar + Line)
```typescript
// apexcharts-dashboard.component.ts
import ApexCharts from 'apexcharts';

export class ApexDashboardComponent {
  createMixedChart(aggregated: AggregatedStatsDto[]) {
    const labels = aggregated[0]?.labels || {};

    const options = {
      chart: { type: 'line' },
      title: {
        text: labels['Chart.Title.Performance'] || 'Operational Performance',
        align: 'center'
      },
      subtitle: {
        text: labels['Chart.Subtitle.Performance'] || 'Efficiency metrics',
        align: 'center'
      },
      series: [
        {
          name: labels['TotalRevenue'] || 'Revenue',
          type: 'column',
          data: aggregated.map(a => a.value)
        },
        {
          name: labels['Chart.Legend.Average'] || 'Average',
          type: 'line',
          data: aggregated.map(a => a.avgValue)
        }
      ],
      xaxis: {
        categories: aggregated.map(a => a.periodLabel),
        title: {
          text: labels['Chart.Axis.Time'] || 'Time'
        }
      },
      yaxis: {
        title: {
          text: labels['Chart.Axis.Revenue'] || 'Revenue ($)'
        }
      },
      legend: {
        show: true,
        position: 'top'
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
            const change = aggregated[dataPointIndex].changePercent;
            const changeText = change >= 0
              ? labels['Chart.Tooltip.Increase'] || 'Increase'
              : labels['Chart.Tooltip.Decrease'] || 'Decrease';
            return `${value} (${changeText}: ${Math.abs(change)}%)`;
          }
        }
      }
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
  }
}
```

---

### 5. Recharts (React) Example

```tsx
// DashboardChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardChartProps {
  stats: DashboardStatsDto;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ stats }) => {
  const labels = stats.labels || {};

  const data = [
    {
      name: labels['TotalRevenue'] || 'Total Revenue',
      value: stats.totalRevenue
    },
    {
      name: labels['NetRevenue'] || 'Net Revenue',
      value: stats.netRevenue
    },
    {
      name: labels['TotalTax'] || 'Tax',
      value: stats.totalTax
    }
  ];

  return (
    <div>
      <h2>{labels['Chart.Title.Revenue'] || 'Revenue and Sales'}</h2>
      <p className="subtitle">{labels['Chart.Subtitle.Revenue'] || 'Revenue analysis'}</p>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            label={{
              value: labels['Chart.Axis.Count'] || 'Metrics',
              position: 'insideBottom',
              offset: -5
            }}
          />
          <YAxis
            label={{
              value: labels['Chart.Axis.Revenue'] || 'Revenue ($)',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend
            payload={[
              { value: labels['Chart.Legend.Actual'] || 'Actual', type: 'square', color: '#8884d8' }
            ]}
          />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
```

---

### 6. Status Badges (Real-Time)

```typescript
// status-badge.component.ts
export class StatusBadgeComponent {
  getStatusLabel(status: string, labels: Record<string, string>): string {
    switch(status) {
      case 'active':
        return labels['Chart.Status.Active'] || 'Active';
      case 'pending':
        return labels['Chart.Status.Pending'] || 'Pending';
      case 'completed':
        return labels['Chart.Status.Completed'] || 'Completed';
      case 'delayed':
        return labels['Chart.Status.Delayed'] || 'Delayed';
      default:
        return status;
    }
  }

  getAlertClass(level: string, labels: Record<string, string>): string {
    const alertLabels = {
      critical: labels['Chart.Alert.Critical'] || 'Critical',
      warning: labels['Chart.Alert.Warning'] || 'Warning',
      info: labels['Chart.Alert.Info'] || 'Info'
    };

    return `alert-${level}`;
  }
}
```

---

### 7. Heatmap (Hour x Day)

```typescript
// heatmap.component.ts
export class HeatmapComponent {
  createHeatmap(aggregated: AggregatedStatsDto[]) {
    const labels = aggregated[0]?.labels || {};

    // Transform data for heatmap
    const heatmapData = aggregated.map(item => ({
      x: item.category,        // Day of week
      y: item.subCategory,     // Hour
      value: item.value
    }));

    const options = {
      chart: { type: 'heatmap' },
      title: {
        text: labels['Chart.Title.Performance'] || 'Performance Heatmap'
      },
      xaxis: {
        title: {
          text: labels['Chart.Axis.Day'] || 'Day of Week'
        }
      },
      yaxis: {
        title: {
          text: labels['Chart.Axis.Hour'] || 'Hour of Day'
        }
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              { from: 0, to: 20, color: '#00A100', name: 'Low' },
              { from: 21, to: 50, color: '#FFB200', name: 'Medium' },
              { from: 51, to: 100, color: '#FF0000', name: 'High' }
            ]
          }
        }
      },
      tooltip: {
        y: {
          formatter: (value) => {
            const ordersLabel = labels['Chart.Tooltip.Orders'] || 'Orders';
            return `${value} ${ordersLabel}`;
          }
        }
      }
    };
  }
}
```

---

## Available Chart Metadata Labels

### Titles (Dashboard)
```
Chart.Title.Dashboard        → "Panel de Control - Restaurante" / "Restaurant Dashboard"
Chart.Title.Revenue          → "Ingresos y Ventas" / "Revenue and Sales"
Chart.Title.Orders           → "Órdenes y Transacciones" / "Orders and Transactions"
Chart.Title.TopItems         → "Platos Más Vendidos" / "Top Selling Dishes"
Chart.Title.Performance      → "Rendimiento Operacional" / "Operational Performance"
Chart.Title.Documents        → "Documentos Fiscales" / "Fiscal Documents"
```

### Titles (Real-Time)
```
Chart.Title.RealTime         → "Monitor en Tiempo Real" / "Real-Time Monitor"
Chart.Title.CurrentActivity  → "Actividad Actual" / "Current Activity"
Chart.Title.KitchenStatus    → "Estado de Cocina" / "Kitchen Status"
Chart.Title.TableStatus      → "Estado de Mesas" / "Table Status"
Chart.Title.LiveOrders       → "Órdenes en Vivo" / "Live Orders"
```

### Subtitles
```
Chart.Subtitle.Revenue       → "Análisis de ingresos y crecimiento" / "Revenue analysis and growth"
Chart.Subtitle.Orders        → "Estado y evolución de órdenes" / "Order status and evolution"
Chart.Subtitle.TopItems      → "Productos con mejor desempeño" / "Best performing products"
Chart.Subtitle.Performance   → "Métricas de eficiencia" / "Efficiency metrics"
Chart.Subtitle.RealTime      → "Actualización cada 30 segundos" / "Updates every 30 seconds"
Chart.Subtitle.LiveFeed      → "Datos en tiempo real" / "Real-time data"
```

### Axis Labels
```
Chart.Axis.Time              → "Tiempo" / "Time"
Chart.Axis.Date              → "Fecha" / "Date"
Chart.Axis.Hour              → "Hora" / "Hour"
Chart.Axis.Day               → "Día" / "Day"
Chart.Axis.Week              → "Semana" / "Week"
Chart.Axis.Month             → "Mes" / "Month"
Chart.Axis.Revenue           → "Ingresos ($)" / "Revenue ($)"
Chart.Axis.Orders            → "Cantidad de Órdenes" / "Order Count"
Chart.Axis.Items             → "Cantidad de Platos" / "Dish Count"
Chart.Axis.Percentage        → "Porcentaje (%)" / "Percentage (%)"
Chart.Axis.Count             → "Cantidad" / "Count"
Chart.Axis.Value             → "Valor" / "Value"
```

### Legends
```
Chart.Legend.Actual          → "Real" / "Actual"
Chart.Legend.Target          → "Objetivo" / "Target"
Chart.Legend.Forecast        → "Pronóstico" / "Forecast"
Chart.Legend.PreviousPeriod  → "Período Anterior" / "Previous Period"
Chart.Legend.CurrentPeriod   → "Período Actual" / "Current Period"
Chart.Legend.Average         → "Promedio" / "Average"
Chart.Legend.Trend           → "Tendencia" / "Trend"
```

### Tooltips
```
Chart.Tooltip.Revenue        → "Ingresos" / "Revenue"
Chart.Tooltip.Orders         → "Órdenes" / "Orders"
Chart.Tooltip.Change         → "Cambio" / "Change"
Chart.Tooltip.ComparedTo     → "comparado con" / "compared to"
Chart.Tooltip.Increase       → "Aumento" / "Increase"
Chart.Tooltip.Decrease       → "Disminución" / "Decrease"
```

### Status & Alerts
```
Chart.Status.Active          → "Activo" / "Active"
Chart.Status.Pending         → "Pendiente" / "Pending"
Chart.Status.Completed       → "Completado" / "Completed"
Chart.Status.Delayed         → "Retrasado" / "Delayed"
Chart.Alert.Critical         → "Crítico" / "Critical"
Chart.Alert.Warning          → "Advertencia" / "Warning"
Chart.Alert.Info             → "Información" / "Info"
```

---

## Best Practices

### ✅ DO
```typescript
// Always provide fallback
const title = labels['Chart.Title.Revenue'] || 'Revenue';

// Use consistent naming
const xAxisLabel = labels['Chart.Axis.Date'] || 'Date';
const yAxisLabel = labels['Chart.Axis.Revenue'] || 'Revenue ($)';

// Combine labels dynamically
const tooltip = `${labels['Chart.Tooltip.Revenue']}: $${value} (${labels['Chart.Tooltip.ComparedTo']} ${previousValue})`;
```

### ❌ DON'T
```typescript
// Hardcode labels
const title = 'Revenue and Sales'; // ❌ Not localized

// Assume labels exist
const title = labels['Chart.Title.Revenue']; // ❌ Could be undefined

// Mix languages
const title = labels['Chart.Title.Revenue'] + ' and Sales'; // ❌ Broken localization
```

---

## API Request Example

```typescript
// Request with language parameter
this.http.get<DashboardStatsDto>('/api/statistics/dashboard', {
  params: { language: 'es' }  // or 'en'
}).subscribe(stats => {
  // stats.labels contains all localized labels
  console.log(stats.labels['Chart.Title.Revenue']); // "Ingresos y Ventas"
  this.createChart(stats);
});
```

---

## Summary

**Key Principles**:
1. ✅ Chart metadata goes in `Labels` dictionary (not separate properties)
2. ✅ Use `Chart.{Category}.{Name}` naming convention
3. ✅ Always provide fallback values in frontend
4. ✅ Backend auto-populates Labels based on `language` parameter
5. ✅ Same Labels dictionary works for all chart libraries (Chart.js, ApexCharts, D3, Recharts)
6. ✅ Frontend stays language-agnostic (no hardcoded strings)

**Advantages**:
- ✅ No extra DTO properties needed
- ✅ Unlimited chart metadata without schema changes
- ✅ Consistent localization pattern
- ✅ Frontend library agnostic
- ✅ Easy to add new languages (just update StatisticsLocalization.cs)
