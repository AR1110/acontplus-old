namespace Restaurant.Domain.Entities.MealManagement;

[Table("CancelledMealConsumption", Schema = "Restaurant")]
public class CancelledMealConsumption : BaseEntity
{
    public int MealConsumptionId { get; set; }

    [MaxLength(500)] public required string Reason { get; set; }

    public int? CancelledByUserId { get; set; }

    public DateTime CancelledAt { get; set; }

    [MaxLength(50)] public string? IpAddress { get; set; }

    // Navigation Properties
    public required MealConsumption MealConsumption { get; set; }
}
