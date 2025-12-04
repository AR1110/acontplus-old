using Acontplus.Analytics.Dtos;

namespace Restaurant.Application.Dtos.Statistics;

/// <summary>
/// Restaurant-specific dashboard statistics extending universal analytics base
/// Maps: TotalTransactions=Orders, UniqueEntities=Customers
/// </summary>
public class DashboardStatsDto : BaseDashboardStatsDto
{
    // === RESTAURANT-SPECIFIC OPERATIONAL METRICS ===
    /// <summary>Average time to prepare food (minutes)</summary>
    public decimal AveragePreparationTime { get; set; }

    /// <summary>Average time from order to delivery (minutes)</summary>
    public decimal AverageServiceTime { get; set; }

    /// <summary>How many times tables are turned over per shift</summary>
    public decimal TableTurnoverRate { get; set; }

    /// <summary>Number of orders during peak hour</summary>
    public int PeakHourOrders { get; set; }

    /// <summary>Time of day with most orders (e.g., "18:00-19:00")</summary>
    public string? PeakHourTime { get; set; }

    /// <summary>Total tips received</summary>
    public decimal TotalTips { get; set; }

    // === RESTAURANT-SPECIFIC DOCUMENT METRICS ===
    /// <summary>Total invoices sent to SRI in period (ES: "Facturas")</summary>
    public int TotalInvoices { get; set; }

    /// <summary>Total delivery notes in period (ES: "Notas de Entrega")</summary>
    public int TotalDeliveryNotes { get; set; }

    /// <summary>Total proforma invoices in period (ES: "Proformas")</summary>
    public int TotalProformas { get; set; }

    /// <summary>Document processing success rate (%) (ES: "Tasa de Procesamiento")</summary>
    public decimal DocumentProcessingRate { get; set; }
}

