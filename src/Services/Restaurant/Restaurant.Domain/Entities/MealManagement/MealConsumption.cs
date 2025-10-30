using Restaurant.Domain.Enums;

namespace Restaurant.Domain.Entities.MealManagement;

[Table("MealConsumption", Schema = "Restaurant")]
public class MealConsumption : BaseEntity
{
    public int MealScheduleSettingId { get; set; }

    public int CompanyCustomerMealPlanId { get; set; }

    public int? OrderId { get; set; }

    public DateTime ConsumptionDate { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? SubsidyAmount { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? CompanyCustomerPayment { get; set; }

    public ConsumptionStatus Status { get; set; }

    // Updated: Nullable, as it's only relevant for cancelled status
    [MaxLength(500)]
    public string? CancellationReason { get; set; }

    // New: Folded from CancelledMealConsumption for cancellation audit
    public int? CancelledByUserId { get; set; }
    public DateTime? CancelledAt { get; set; }
    [MaxLength(50)] public string? CancelledIpAddress { get; set; }

    // Navigation Properties
    public required MealScheduleSetting MealScheduleSetting { get; set; }
    // New: Direct nav to plan
    public required CompanyCustomerMealPlan CompanyCustomerMealPlan { get; set; }
    public Order? Order { get; set; }
    // New: Simplified audit as JSON (e.g., for change history)
    [Column(TypeName = "nvarchar(max)")]
    public string? AuditLog { get; set; }  // JSON string for actions, reasons, dates, IPs
}
