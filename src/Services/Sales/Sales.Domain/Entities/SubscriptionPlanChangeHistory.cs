namespace Sales.Domain.Entities;

[Table("SubscriptionPlanChangeHistory", Schema = "Sales")]
public class SubscriptionPlanChangeHistory : BaseEntity
{
    public Subscription Subscription { get; set; } = null!;
    public int SubscriptionId { get; set; }

    public int OldPricingPlanId { get; set; }
    public int NewPricingPlanId { get; set; }
    public DateTime ChangeDate { get; set; }

    [MaxLength(100)] public string Reason { get; set; } = string.Empty; // "upgrade", "downgrade", "custom"
    [MaxLength(500)] public string? Notes { get; set; }

    // Información del cambio
    public decimal? OldPlanCost { get; set; }
    public decimal? NewPlanCost { get; set; }
    public decimal? ChangeCost { get; set; }
    public bool IsProrated { get; set; } = false;

    public string? ProcessedBy { get; set; }
    public string? ProcessedByUser { get; set; }
}