namespace Restaurant.Application.Helpers;

/// <summary>
/// Provides localized labels for statistics charts and UI components
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
                // Base Transaction Metrics (Restaurant Context: Orders)
                ["TotalTransactions"] = "Total de Órdenes",
                ["CompletedTransactions"] = "Órdenes Completadas",
                ["CancelledTransactions"] = "Órdenes Canceladas",
                ["ActiveTransactions"] = "Órdenes Activas",
                ["CompletionRate"] = "Tasa de Completitud de Órdenes (%)",
                ["AverageTransactionValue"] = "Valor Promedio por Orden",

                // Base Revenue Metrics
                ["TotalRevenue"] = "Ingresos Totales",
                ["NetRevenue"] = "Ingresos Netos",
                ["TotalTax"] = "Total de Impuestos (IVA)",
                ["TotalDiscounts"] = "Descuentos Totales",
                ["GrowthRate"] = "Tasa de Crecimiento (%)",
                ["RevenuePerEntity"] = "Ingresos Promedio por Cliente",

                // Base Volume Metrics (Restaurant Context: Dishes/Menu Items)
                ["TotalItemsProcessed"] = "Total de Platos Servidos",
                ["AverageItemsPerTransaction"] = "Platos Promedio por Orden",
                ["TopItem"] = "Plato Más Vendido",
                ["TopItemQuantity"] = "Cantidad del Plato Top",

                // Restaurant-Specific Operational
                ["AveragePreparationTime"] = "Tiempo Promedio de Preparación (min)",
                ["AverageServiceTime"] = "Tiempo Promedio de Servicio (min)",
                ["TableTurnoverRate"] = "Tasa de Rotación de Mesas",
                ["PeakHourOrders"] = "Pedidos en Hora Pico",
                ["PeakHourTime"] = "Hora Pico",
                ["TotalTips"] = "Propinas Totales",

                // Restaurant-Specific Documents
                ["TotalInvoices"] = "Facturas",
                ["TotalDeliveryNotes"] = "Notas de Entrega",
                ["TotalProformas"] = "Proformas",
                ["DocumentProcessingRate"] = "Tasa de Procesamiento de Documentos (%)",

                // Chart Metadata - Titles
                ["Chart.Title.Dashboard"] = "Panel de Control - Restaurante",
                ["Chart.Title.Revenue"] = "Ingresos y Ventas",
                ["Chart.Title.Orders"] = "Órdenes y Transacciones",
                ["Chart.Title.TopItems"] = "Platos Más Vendidos",
                ["Chart.Title.Performance"] = "Rendimiento Operacional",
                ["Chart.Title.Documents"] = "Documentos Fiscales",

                // Chart Metadata - Subtitles
                ["Chart.Subtitle.Revenue"] = "Análisis de ingresos y crecimiento",
                ["Chart.Subtitle.Orders"] = "Estado y evolución de órdenes",
                ["Chart.Subtitle.TopItems"] = "Productos con mejor desempeño",
                ["Chart.Subtitle.Performance"] = "Métricas de eficiencia",

                // Chart Metadata - Axis Labels
                ["Chart.Axis.Time"] = "Tiempo",
                ["Chart.Axis.Date"] = "Fecha",
                ["Chart.Axis.Hour"] = "Hora",
                ["Chart.Axis.Day"] = "Día",
                ["Chart.Axis.Week"] = "Semana",
                ["Chart.Axis.Month"] = "Mes",
                ["Chart.Axis.Revenue"] = "Ingresos ($)",
                ["Chart.Axis.Orders"] = "Cantidad de Órdenes",
                ["Chart.Axis.Items"] = "Cantidad de Platos",
                ["Chart.Axis.Percentage"] = "Porcentaje (%)",
                ["Chart.Axis.Count"] = "Cantidad",
                ["Chart.Axis.Value"] = "Valor",

                // Chart Metadata - Legends
                ["Chart.Legend.Actual"] = "Real",
                ["Chart.Legend.Target"] = "Objetivo",
                ["Chart.Legend.Forecast"] = "Pronóstico",
                ["Chart.Legend.PreviousPeriod"] = "Período Anterior",
                ["Chart.Legend.CurrentPeriod"] = "Período Actual",
                ["Chart.Legend.Average"] = "Promedio",
                ["Chart.Legend.Trend"] = "Tendencia",

                // Chart Metadata - Tooltips
                ["Chart.Tooltip.Revenue"] = "Ingresos",
                ["Chart.Tooltip.Orders"] = "Órdenes",
                ["Chart.Tooltip.Change"] = "Cambio",
                ["Chart.Tooltip.ComparedTo"] = "comparado con",
                ["Chart.Tooltip.Increase"] = "Aumento",
                ["Chart.Tooltip.Decrease"] = "Disminución",
            },

            "en" => new Dictionary<string, string>
            {
                // Base Transaction Metrics (Restaurant Context: Orders)
                ["TotalTransactions"] = "Total Orders",
                ["CompletedTransactions"] = "Completed Orders",
                ["CancelledTransactions"] = "Cancelled Orders",
                ["ActiveTransactions"] = "Active Orders",
                ["CompletionRate"] = "Order Completion Rate (%)",
                ["AverageTransactionValue"] = "Average Order Value",

                // Base Revenue Metrics
                ["TotalRevenue"] = "Total Revenue",
                ["NetRevenue"] = "Net Revenue",
                ["TotalTax"] = "Total Tax (VAT)",
                ["TotalDiscounts"] = "Total Discounts",
                ["GrowthRate"] = "Growth Rate (%)",
                ["RevenuePerEntity"] = "Average Revenue per Customer",

                // Base Volume Metrics (Restaurant Context: Dishes/Menu Items)
                ["TotalItemsProcessed"] = "Total Dishes Served",
                ["AverageItemsPerTransaction"] = "Average Dishes per Order",
                ["TopItem"] = "Top Selling Dish",
                ["TopItemQuantity"] = "Top Dish Quantity",

                // Restaurant-Specific Operational
                ["AveragePreparationTime"] = "Average Preparation Time (min)",
                ["AverageServiceTime"] = "Average Service Time (min)",
                ["TableTurnoverRate"] = "Table Turnover Rate",
                ["PeakHourOrders"] = "Peak Hour Orders",
                ["PeakHourTime"] = "Peak Hour Time",
                ["TotalTips"] = "Total Tips",

                // Restaurant-Specific Documents
                ["TotalInvoices"] = "Invoices",
                ["TotalDeliveryNotes"] = "Delivery Notes",
                ["TotalProformas"] = "Proforma Invoices",
                ["DocumentProcessingRate"] = "Document Processing Rate (%)",

                // Chart Metadata - Titles
                ["Chart.Title.Dashboard"] = "Restaurant Dashboard",
                ["Chart.Title.Revenue"] = "Revenue and Sales",
                ["Chart.Title.Orders"] = "Orders and Transactions",
                ["Chart.Title.TopItems"] = "Top Selling Dishes",
                ["Chart.Title.Performance"] = "Operational Performance",
                ["Chart.Title.Documents"] = "Fiscal Documents",

                // Chart Metadata - Subtitles
                ["Chart.Subtitle.Revenue"] = "Revenue analysis and growth",
                ["Chart.Subtitle.Orders"] = "Order status and evolution",
                ["Chart.Subtitle.TopItems"] = "Best performing products",
                ["Chart.Subtitle.Performance"] = "Efficiency metrics",

                // Chart Metadata - Axis Labels
                ["Chart.Axis.Time"] = "Time",
                ["Chart.Axis.Date"] = "Date",
                ["Chart.Axis.Hour"] = "Hour",
                ["Chart.Axis.Day"] = "Day",
                ["Chart.Axis.Week"] = "Week",
                ["Chart.Axis.Month"] = "Month",
                ["Chart.Axis.Revenue"] = "Revenue ($)",
                ["Chart.Axis.Orders"] = "Order Count",
                ["Chart.Axis.Items"] = "Dish Count",
                ["Chart.Axis.Percentage"] = "Percentage (%)",
                ["Chart.Axis.Count"] = "Count",
                ["Chart.Axis.Value"] = "Value",

                // Chart Metadata - Legends
                ["Chart.Legend.Actual"] = "Actual",
                ["Chart.Legend.Target"] = "Target",
                ["Chart.Legend.Forecast"] = "Forecast",
                ["Chart.Legend.PreviousPeriod"] = "Previous Period",
                ["Chart.Legend.CurrentPeriod"] = "Current Period",
                ["Chart.Legend.Average"] = "Average",
                ["Chart.Legend.Trend"] = "Trend",

                // Chart Metadata - Tooltips
                ["Chart.Tooltip.Revenue"] = "Revenue",
                ["Chart.Tooltip.Orders"] = "Orders",
                ["Chart.Tooltip.Change"] = "Change",
                ["Chart.Tooltip.ComparedTo"] = "compared to",
                ["Chart.Tooltip.Increase"] = "Increase",
                ["Chart.Tooltip.Decrease"] = "Decrease",
            },

            _ => GetDashboardLabels("es") // Default to Spanish
        };
    }

    /// <summary>
    /// Gets localized labels for real-time statistics
    /// </summary>
    /// <param name="language">ISO 639-1 language code (default: "es")</param>
    public static Dictionary<string, string> GetRealTimeLabels(string language = "es")
    {
        return language.ToLower() switch
        {
            "es" => new Dictionary<string, string>
            {
                // Base Current Activity (Restaurant Context: Orders/Dining Activity)
                ["ActiveOperations"] = "Órdenes Activas",
                ["OperationsLast5Min"] = "Órdenes (Últimos 5 min)",
                ["OperationsLast15Min"] = "Órdenes (Últimos 15 min)",
                ["OperationsThisHour"] = "Órdenes (Esta Hora)",

                // Base Revenue Tracking
                ["CurrentHourRevenue"] = "Ingresos Hora Actual",
                ["TodayRevenue"] = "Ingresos Hoy",
                ["AverageTicketSize"] = "Cuenta Promedio",

                // Base Processing Metrics (Restaurant Context: Kitchen/Service Flow)
                ["ItemsInQueue"] = "Platos Pendientes",
                ["ItemsInProcess"] = "Platos en Preparación",
                ["ItemsCompleted"] = "Platos Servidos",
                ["AverageProcessingTime"] = "Tiempo Promedio de Servicio (min)",
                ["OldestPendingMinutes"] = "Orden Más Antigua (min)",
                ["DelayedOrders"] = "Órdenes Retrasadas",

                // Base Performance
                ["OperationsPerHour"] = "Órdenes por Hora",
                ["RevenuePerHour"] = "Ingresos por Hora",

                // Base Capacity (Restaurant Context: Tables)
                ["TotalCapacity"] = "Total de Mesas",
                ["UsedCapacity"] = "Mesas Ocupadas",
                ["AvailableCapacity"] = "Mesas Disponibles",
                ["CapacityUtilization"] = "Ocupación de Mesas (%)",

                // Restaurant-Specific Tables
                ["TotalTables"] = "Total de Mesas",
                ["OccupiedTables"] = "Mesas Ocupadas",
                ["AvailableTables"] = "Mesas Disponibles",
                ["ReservedTables"] = "Mesas Reservadas",
                ["TableOccupancyRate"] = "Ocupación de Mesas (%)",

                // Restaurant-Specific Kitchen
                ["ItemsInPreparation"] = "Ítems en Preparación",
                ["ItemsReady"] = "Ítems Listos",
                ["AverageKitchenTime"] = "Tiempo Promedio de Cocina (min)",

                // Restaurant-Specific Service
                ["ActiveWaiters"] = "Meseros Activos",
                ["CurrentShiftRevenue"] = "Ingresos Turno Actual",
                ["CurrentPeakStatus"] = "Estado de Afluencia",

                // Restaurant-Specific Documents
                ["TotalInvoices"] = "Facturas Hoy",
                ["TotalDeliveryNotes"] = "Notas de Entrega Hoy",
                ["TotalProformas"] = "Proformas Hoy",
                ["ProcessedDocuments"] = "Documentos Procesados",

                // Chart Metadata - RealTime Specific
                ["Chart.Title.RealTime"] = "Monitor en Tiempo Real",
                ["Chart.Title.CurrentActivity"] = "Actividad Actual",
                ["Chart.Title.KitchenStatus"] = "Estado de Cocina",
                ["Chart.Title.TableStatus"] = "Estado de Mesas",
                ["Chart.Title.LiveOrders"] = "Órdenes en Vivo",
                ["Chart.Subtitle.RealTime"] = "Actualización cada 30 segundos",
                ["Chart.Subtitle.LiveFeed"] = "Datos en tiempo real",
                ["Chart.Status.Active"] = "Activo",
                ["Chart.Status.Pending"] = "Pendiente",
                ["Chart.Status.Completed"] = "Completado",
                ["Chart.Status.Delayed"] = "Retrasado",
                ["Chart.Alert.Critical"] = "Crítico",
                ["Chart.Alert.Warning"] = "Advertencia",
                ["Chart.Alert.Info"] = "Información",
            },

            "en" => new Dictionary<string, string>
            {
                // Base Current Activity (Restaurant Context: Orders/Dining Activity)
                ["ActiveOperations"] = "Active Orders",
                ["OperationsLast5Min"] = "Orders (Last 5 min)",
                ["OperationsLast15Min"] = "Orders (Last 15 min)",
                ["OperationsThisHour"] = "Orders (This Hour)",

                // Base Revenue Tracking
                ["CurrentHourRevenue"] = "Current Hour Revenue",
                ["TodayRevenue"] = "Today's Revenue",
                ["AverageTicketSize"] = "Average Check Size",

                // Base Processing Metrics (Restaurant Context: Kitchen/Service Flow)
                ["ItemsInQueue"] = "Pending Dishes",
                ["ItemsInProcess"] = "Dishes in Preparation",
                ["ItemsCompleted"] = "Dishes Served",
                ["AverageProcessingTime"] = "Average Service Time (min)",
                ["OldestPendingMinutes"] = "Oldest Order (min)",
                ["DelayedOrders"] = "Delayed Orders",

                // Base Performance
                ["OperationsPerHour"] = "Orders per Hour",
                ["RevenuePerHour"] = "Revenue per Hour",

                // Base Capacity (Restaurant Context: Tables)
                ["TotalCapacity"] = "Total Tables",
                ["UsedCapacity"] = "Occupied Tables",
                ["AvailableCapacity"] = "Available Tables",
                ["CapacityUtilization"] = "Table Occupancy (%)",

                // Restaurant-Specific Tables
                ["TotalTables"] = "Total Tables",
                ["OccupiedTables"] = "Occupied Tables",
                ["AvailableTables"] = "Available Tables",
                ["ReservedTables"] = "Reserved Tables",
                ["TableOccupancyRate"] = "Table Occupancy Rate (%)",

                // Restaurant-Specific Kitchen
                ["ItemsInPreparation"] = "Items in Preparation",
                ["ItemsReady"] = "Items Ready",
                ["AverageKitchenTime"] = "Average Kitchen Time (min)",

                // Restaurant-Specific Service
                ["ActiveWaiters"] = "Active Waiters",
                ["CurrentShiftRevenue"] = "Current Shift Revenue",
                ["CurrentPeakStatus"] = "Current Peak Status",

                // Restaurant-Specific Documents
                ["TotalInvoices"] = "Invoices Today",
                ["TotalDeliveryNotes"] = "Delivery Notes Today",
                ["TotalProformas"] = "Proforma Invoices Today",
                ["ProcessedDocuments"] = "Processed Documents",

                // Chart Metadata - RealTime Specific
                ["Chart.Title.RealTime"] = "Real-Time Monitor",
                ["Chart.Title.CurrentActivity"] = "Current Activity",
                ["Chart.Title.KitchenStatus"] = "Kitchen Status",
                ["Chart.Title.TableStatus"] = "Table Status",
                ["Chart.Title.LiveOrders"] = "Live Orders",
                ["Chart.Subtitle.RealTime"] = "Updates every 30 seconds",
                ["Chart.Subtitle.LiveFeed"] = "Real-time data",
                ["Chart.Status.Active"] = "Active",
                ["Chart.Status.Pending"] = "Pending",
                ["Chart.Status.Completed"] = "Completed",
                ["Chart.Status.Delayed"] = "Delayed",
                ["Chart.Alert.Critical"] = "Critical",
                ["Chart.Alert.Warning"] = "Warning",
                ["Chart.Alert.Info"] = "Info",
            },

            _ => GetRealTimeLabels("es") // Default to Spanish
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
                ["gauge"] = "Indicador",
                ["heatmap"] = "Mapa de Calor",
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
                ["gauge"] = "Gauge",
                ["heatmap"] = "Heatmap",
            },
            _ => GetChartTypeLabels("es")
        };
    }
}
