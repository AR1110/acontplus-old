using Restaurant.Domain.Enums;

namespace Restaurant.Domain.Entities.MealManagement;

[Table("MealConsumption", Schema = "Restaurant")]
public class MealConsumption: BaseEntity
{
    public int MealScheduleSettingId { get; set; }

    public int MonthlyAllowanceId { get; set; }

    public int? OrderId { get; set; }

    public DateTime ConsumptionDate { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? SubsidyAmount { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? CompanyCustomerPayment { get; set; }

    public ConsumptionStatus Status { get; set; }

    [MaxLength(500)]
    public required string CancellationReason { get; set; }

    // Navigation Properties
    public required MealScheduleSetting MealScheduleSetting { get; set; }
    public required MonthlyMealAllowance MonthlyMealAllowance { get; set; }
    public Order? Order { get; set; }
    public ICollection<MealConsumptionAudit> MealConsumptionAudits { get; set; } = new List<MealConsumptionAudit>();
}
