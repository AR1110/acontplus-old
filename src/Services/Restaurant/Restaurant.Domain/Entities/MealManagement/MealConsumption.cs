using Restaurant.Domain.Enums;

namespace Restaurant.Domain.Entities.MealManagement;

public class MealConsumption: BaseEntity
{
    public int EmployeeId { get; set; }

    public int MealScheduleSettingId { get; set; }

    public int? MonthlyAllowanceId { get; set; }

    public DateTime ConsumptionDate { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal SubsidyAmount { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal EmployeePayment { get; set; }

    public ConsumptionStatus Status { get; set; }

    [MaxLength(500)]
    public required string CancellationReason { get; set; }

    // Navigation Properties
    public required MealScheduleSettings MealSchedule { get; set; }
    public MonthlyMealAllowance? MonthlyAllowance { get; set; }
    public ICollection<MealConsumptionAudit> AuditTrail { get; set; }
}
