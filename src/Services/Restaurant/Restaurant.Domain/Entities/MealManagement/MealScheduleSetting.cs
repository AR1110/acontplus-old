namespace Restaurant.Domain.Entities.MealManagement;

[Table("MealScheduleSetting", Schema = "Restaurant")]
public class MealScheduleSetting : BaseEntity
{
    public int EstablishmentId { get; set; }

    [MaxLength(10)] public required string MealCode { get; set; }

    [MaxLength(100)] public required string Description { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public int DisplayOrder { get; set; }

    // Navigation Properties
    public ICollection<MealConsumption> MealConsumptions { get; set; } = new List<MealConsumption>();
    public ICollection<MealPlanSchedule> MealPlanSchedules { get; set; } = new List<MealPlanSchedule>();
    public ICollection<DailyMenu> DailyMenus { get; set; } = new List<DailyMenu>();
}
