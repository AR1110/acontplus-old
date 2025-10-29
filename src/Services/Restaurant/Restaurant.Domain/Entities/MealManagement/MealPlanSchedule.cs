namespace Restaurant.Domain.Entities.MealManagement;

[Table("MealPlanSchedule", Schema = "Restaurant")]
public class MealPlanSchedule : BaseEntity
{

    public int MealPlanId { get; set; }

    public int MealScheduleSettingId { get; set; }

    public bool IsIncluded { get; set; }

    // Navigation Properties
    public required MealPlan MealPlan { get; set; }
    public required MealScheduleSetting MealScheduleSetting { get; set; }
}
