namespace Restaurant.Domain.Entities.MealManagement;

[Table("DailyMenu", Schema = "Restaurant")]
public class DailyMenu : BaseEntity
{
    public int EstablishmentId { get; set; }

    public DateTime MenuDate { get; set; }

    public int MealScheduleSettingId { get; set; }

    public int? MealPlanId { get; set; }

    [MaxLength(1000)] public required string Description { get; set; }

    [Column(TypeName = "decimal(10,2)")] public decimal StandardPrice { get; set; }

    public bool IsAvailable { get; set; }

    // Navigation Properties
    public required MealScheduleSetting MealScheduleSetting { get; set; }
    public MealPlan? MealPlan { get; set; }
}
