namespace Restaurant.Domain.Entities.MealManagement;

public class MealPlan : BaseEntity
{
    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    public int DailyMealLimit { get; set; }

    public int MonthlyMealLimit { get; set; }

    [Column(TypeName = "decimal(5,2)")] public decimal SubsidyPercentage { get; set; }

    // Navigation Properties
    public ICollection<MealPlanSchedule> AllowedSchedules { get; set; } = new List<MealPlanSchedule>();
}
