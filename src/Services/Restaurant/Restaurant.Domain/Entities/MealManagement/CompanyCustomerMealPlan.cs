using System.ComponentModel.DataAnnotations.Schema;

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

    // New: Override for monthly allocated meals (falls back to MealPlan.MonthlyMealLimit if null)
    public int? MonthlyAllocatedMealsOverride { get; set; }

    // Navigation Properties
    public required MealPlan MealPlan { get; set; }

    public ICollection<MealConsumption> MealConsumptions { get; set; } = new List<MealConsumption>();
}
