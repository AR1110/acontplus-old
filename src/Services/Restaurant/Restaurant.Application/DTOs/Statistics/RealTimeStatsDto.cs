using Acontplus.Analytics.Dtos;

namespace Restaurant.Application.Dtos.Statistics;

/// <summary>
/// Restaurant-specific real-time statistics extending universal analytics base
/// Maps: ActiveOperations=Orders, ItemsInQueue/Process/Completed=Kitchen items
/// </summary>
public class RealTimeStatsDto : BaseRealTimeStatsDto
{
    // === RESTAURANT-SPECIFIC TABLE STATUS ===
    /// <summary>Total number of tables in restaurant</summary>
    public int TotalTables { get; set; }

    /// <summary>Currently occupied tables</summary>
    public int OccupiedTables { get; set; }

    /// <summary>Available tables</summary>
    public int AvailableTables { get; set; }

    /// <summary>Reserved tables</summary>
    public int ReservedTables { get; set; }

    /// <summary>Table occupancy rate (%)</summary>
    public decimal TableOccupancyRate { get; set; }

    // === RESTAURANT-SPECIFIC KITCHEN METRICS ===
    /// <summary>Items currently being prepared (maps to ItemsInProcess from base)</summary>
    public int ItemsInPreparation { get; set; }

    /// <summary>Items ready for serving (maps to ItemsCompleted from base)</summary>
    public int ItemsReady { get; set; }

    /// <summary>Average kitchen preparation time - alias for AverageProcessingTime</summary>
    public decimal AverageKitchenTime { get; set; }

    /// <summary>Number of orders running behind schedule</summary>
    public int DelayedOrders { get; set; }

    // === RESTAURANT-SPECIFIC SERVICE METRICS ===
    /// <summary>Number of active waiters/servers on duty</summary>
    public int ActiveWaiters { get; set; }

    /// <summary>Revenue for current shift</summary>
    public decimal CurrentShiftRevenue { get; set; }

    /// <summary>Peak status indicator (e.g., "High", "Normal", "Low")</summary>
    public string? CurrentPeakStatus { get; set; }

    // === RESTAURANT-SPECIFIC DOCUMENT METRICS ===
    /// <summary>Total invoices sent to SRI today (ES: "Facturas")</summary>
    public int TotalInvoices { get; set; }

    /// <summary>Total delivery notes today (ES: "Notas de Entrega")</summary>
    public int TotalDeliveryNotes { get; set; }

    /// <summary>Total proforma invoices today (ES: "Proformas")</summary>
    public int TotalProformas { get; set; }

    /// <summary>Total processed/completed documents today (ES: "Documentos Procesados")</summary>
    public int ProcessedDocuments { get; set; }
}
