namespace Restaurant.Domain.Entities.MealManagement;

public class MonthlyMealAllowance
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public int Year { get; set; }

    public int Month { get; set; }

    public int AllocatedMeals { get; set; }

    public int ConsumedMeals { get; set; }

    public int RemainingMeals { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalSubsidy { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal EmployeeContribution { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastUpdated { get; set; }

    // Navigation Properties
    public virtual ICollection<MealConsumption> Consumptions { get; set; }
}
