namespace Restaurant.Domain.Entities.MealManagement;

public class MealPlanSchedule : BaseEntity
{

    public int MealPlanId { get; set; }

    public int MealScheduleSettingId { get; set; }

    public bool IsIncluded { get; set; }

    // Navigation Properties
    public required MealPlan MealPlan { get; set; }
    public required MealScheduleSettings MealSchedule { get; set; }
}
