namespace Sales.Domain.Entities;

[Table("SubscriptionRenewalHistory", Schema = "Sales")]
public class SubscriptionRenewalHistory : BaseEntity
{
    public Subscription Subscription { get; set; } = null!;
    public int SubscriptionId { get; set; }

    public DateTime OldEndDate { get; set; }
    public DateTime NewEndDate { get; set; }
    public DateTime RenewalDate { get; set; }

    [MaxLength(100)] public string Reason { get; set; } = string.Empty; // "auto", "manual", "plan_change"
    [MaxLength(500)] public string? Notes { get; set; }

    // Información de la renovación
    public decimal? RenewalCost { get; set; }
    public decimal? RenewalTax { get; set; }
    public decimal? RenewalDiscount { get; set; }
    public decimal? RenewalTotal { get; set; }

    public string? ProcessedBy { get; set; }
    public string? ProcessedByUser { get; set; }
}