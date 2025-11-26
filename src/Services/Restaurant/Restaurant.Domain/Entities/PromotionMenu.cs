namespace Restaurant.Domain.Entities;

[Table("PromotionMenu", Schema = "Restaurant")]
public class PromotionMenu : BaseEntity
{
    public required Promotion Promotion { get; set; }
    public int PromotionId { get; set; }
    public required Menu Menu { get; set; }
    public int MenuId { get; set; }
}
