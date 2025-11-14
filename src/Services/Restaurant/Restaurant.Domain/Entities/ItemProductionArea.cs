namespace Restaurant.Domain.Entities;

[Table("ItemProductionArea", Schema = "Restaurant")]
public class ItemProductionArea : BaseEntity
{
    public int ItemId { get; set; }
    public required Item Item { get; set; }
    public int ProductionAreaId { get; set; }
    public required ProductionArea ProductionArea { get; set; }
}
