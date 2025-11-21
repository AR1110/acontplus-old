namespace Restaurant.Domain.Entities;

[Table("MenuItem", Schema = "Restaurant")]
public class MenuItem : BaseEntity
{
    public required Menu Menu { get; set; }
    public int MenuId { get; set; }
    public required Item Item { get; set; }
    public int ItemId { get; set; }
    public int FeeId { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal? Quantity { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal? DiscountPercent { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal? DiscountValue { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal? Subtotal { get; set; }
}
