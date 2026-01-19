namespace Identity.Domain.Entities;

[Table("PricingPlanAccessDetail", Schema = "Access")]
public class PricingPlanAccessDetail : BaseEntity
{
    public required PricingPlanAccess PricingPlanAccess { get; set; }
    public int PricingPlanAccessId { get; set; }

    public int? Order { get; set; }

    /// <summary>
    /// FK to Config.Menu - navigation removed for cross-service boundary
    /// </summary>
    public int? MenuId { get; set; }

    [MaxLength(1000)]
    public string? Actions { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}
