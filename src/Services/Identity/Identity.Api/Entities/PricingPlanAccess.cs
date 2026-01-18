namespace Identity.Api.Entities;

[Table("PricingPlanAccess", Schema = "Seguridad")]
public class PricingPlanAccess : BaseEntity
{
    public required PricingPlan PricingPlan { get; set; }
    public int PricingPlanId { get; set; }

    public required Role Role { get; set; }
    public int RoleId { get; set; }
    public DateTime? ActivatedAt { get; set; }

    public DateTime? DeactivatedAt { get; set; }

    [MaxLength(500)] public string? Notes { get; set; }

    public ICollection<PricingPlanAccessDetail> PricingPlanAccessDetails { get; set; } =
        new List<PricingPlanAccessDetail>();
}