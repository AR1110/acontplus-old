namespace Restaurant.Domain.Entities;

[Table("PromotionDetail", Schema = "Restaurant")]
public class PromotionDetail : BaseEntity
{
    public required Promotion Promotion { get; set; }
    public int PromotionId { get; set; }
    public required Item Item { get; set; }
    public int ItemId { get; set; }
    public int FeeId { get; set; }
    public int TaxId { get; set; }
    public int MeasureId { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal RequiredQuantity { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal PromotionalPrice { get; set; }
    [MaxLength(500)] public string? Notes { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(5,2)")] public decimal? DiscountPercent { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal? Discount { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal Subtotal { get; set; }
    public int DisplayOrder { get; set; }
    public int? BuyQuantity { get; set; }
    public int? GetQuantity { get; set; }
    public PromotionItemRole Role { get; set; } = PromotionItemRole.Included;
}

public enum PromotionItemRole
{
    Included = 1,
    Required = 2,
    Free = 3,
    Discounted = 4
}
