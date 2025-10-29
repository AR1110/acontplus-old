namespace Restaurant.Domain.Entities.MealManagement;

[Table("CompanyCustomerMealPlan", Schema = "Restaurant")]
public class CompanyCustomerMealPlan : BaseEntity
{
    public int CompanyCustomerId { get; set; }

    public int MealPlanId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Navigation Properties
    public required MealPlan MealPlan { get; set; }
    public ICollection<MonthlyMealAllowance> MonthlyMealAllowances { get; set; } = new List<MonthlyMealAllowance>();
}
