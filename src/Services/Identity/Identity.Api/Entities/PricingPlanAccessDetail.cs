namespace Identity.Api.Entities;

[Table("PricingPlanAccessDetail", Schema = "Seguridad")]
public class PricingPlanAccessDetail : BaseEntity
{
    public required PricingPlanAccess PricingPlanAccess { get; set; }
    public int PricingPlanAccessId { get; set; }

    public int? Order { get; set; }

    public int? MenuId { get; set; }

    public Menu? Menu { get; set; }

    [MaxLength(1000)]
    public string? Actions { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}
