namespace Restaurant.Domain.Entities;

[Table("ItemComposition", Schema = "Restaurant")]
public class ItemComposition : BaseEntity
{
    public ICollection<ItemComposition> Children { get; set; } = [];
    public required Item Item { get; set; }
    public int ItemId { get; set; }
    public required Item ChildItem { get; set; }
    public int ChildItemId { get; set; }
    public int? FeeId { get; set; }
    public int? TaxId { get; set; }
    public int? MeasureId { get; set; }
    public int? ExtentId { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal Quantity { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal Price { get; set; }
    public string? Instructions { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Weight { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? NetWeight { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal CostPrice { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? DiscountPercent { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal Subtotal { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? WastePercentage { get; set; }
    public bool IsOptional { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? ExtraCharge { get; set; }
    public string? UniqueId { get; set; }
}
