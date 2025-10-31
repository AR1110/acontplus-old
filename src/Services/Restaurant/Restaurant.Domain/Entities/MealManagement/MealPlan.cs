namespace Restaurant.Domain.Entities.MealManagement;

[Table("MealPlan", Schema = "Restaurant")]
public class MealPlan : BaseEntity
{
    public int EstablishmentId { get; set; }
    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    public int DailyMealLimit { get; set; }

    public int MonthlyMealLimit { get; set; }

    [Column(TypeName = "decimal(5,2)")] public decimal SubsidyPercentage { get; set; }

    public bool IsDefault { get; set; }

    // Navigation Properties
    public ICollection<MealPlanSchedule> MealPlanSchedules { get; set; } = new List<MealPlanSchedule>();
    public ICollection<CompanyCustomerMealPlan> CompanyCustomerMealPlans { get; set; } = new List<CompanyCustomerMealPlan>();
    public ICollection<DailyMenu> DailyMenus { get; set; } = new List<DailyMenu>();
}
