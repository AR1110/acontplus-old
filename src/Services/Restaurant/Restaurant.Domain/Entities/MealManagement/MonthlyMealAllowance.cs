namespace Restaurant.Domain.Entities.MealManagement;

[Table("MonthlyMealAllowance", Schema = "Restaurant")]
public class MonthlyMealAllowance: BaseEntity
{
    public int CompanyCustomerMealPlanId { get; set; }

    public int Year { get; set; }

    public int Month { get; set; }

    public int AllocatedMeals { get; set; }

    public int ConsumedMeals { get; set; }

    public int RemainingMeals { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? TotalSubsidy { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? CompanyCustomerContribution { get; set; }

    // Navigation Properties
    public required CompanyCustomerMealPlan CompanyCustomerMealPlan { get; set; }
    public ICollection<MealConsumption> MealConsumptions { get; set; } = new List<MealConsumption>();
}
