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

    [Column(TypeName = "decimal(18,5)")]
    public decimal Quantity { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal Price { get; set; }
    public string? Obs { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal CostPrice { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? DiscountPercent { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal Subtotal { get; set; }
    public string? UniqueId { get; set; }
}

