namespace Identity.Api.Entities;

[Table("PricingPlanAccess", Schema = "Access")]
public class PricingPlanAccess : BaseEntity
{
    /// <summary>
    /// FK to Sales.PricingPlan - navigation removed for cross-service boundary
    /// </summary>
    public int PricingPlanId { get; set; }

    /// <summary>
    /// FK to Identity.AppRole - navigation removed for cross-service boundary
    /// </summary>
    public int RoleId { get; set; }
    public DateTime? ActivatedAt { get; set; }

    public DateTime? DeactivatedAt { get; set; }

    [MaxLength(500)] public string? Notes { get; set; }

    public ICollection<PricingPlanAccessDetail> PricingPlanAccessDetails { get; set; } =
        new List<PricingPlanAccessDetail>();
}
