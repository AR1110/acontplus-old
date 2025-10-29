namespace Restaurant.Domain.Entities.MealManagement;

public class MealConsumptionAudit : BaseEntity
{
    public int MealConsumptionId { get; set; }
    [MaxLength(50)] public required string Action { get; set; }

    [MaxLength(500)] public string? Reason { get; set; }

    public int? UserId { get; set; }

    public DateTime ActionDate { get; set; }

    [MaxLength(50)] public string? IpAddress { get; set; }

    public string? AdditionalData { get; set; }

    // Navigation Properties
    public required MealConsumption MealConsumption { get; set; }
}
