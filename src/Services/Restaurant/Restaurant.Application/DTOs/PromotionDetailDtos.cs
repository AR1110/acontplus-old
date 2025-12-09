namespace Restaurant.Application.Dtos;

public record PromotionDetailCreate
{
    public int Id { get; init; }
    public int PromotionId { get; init; }
    public int ItemId { get; init; }
    public int FeeId { get; init; }
    public int TaxId { get; init; }
    public int MeasureId { get; init; }
    public decimal RequiredQuantity { get; init; }
    public decimal PromotionalPrice { get; init; }
    public string? Notes { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal? DiscountPercent { get; init; }
    public decimal? Discount { get; init; }
    public decimal Subtotal { get; init; }
    public int DisplayOrder { get; init; }
    public int? BuyQuantity { get; init; }
    public int? GetQuantity { get; init; }
    public int Role { get; init; }
    public bool IsActive { get; init; }
}

public record PromotionDetailUpdate
{
    public int Id { get; init; }
    public int PromotionId { get; init; }
    public int ItemId { get; init; }
    public int FeeId { get; init; }
    public int TaxId { get; init; }
    public int MeasureId { get; init; }

    public decimal RequiredQuantity { get; init; }
    public decimal PromotionalPrice { get; init; }
    public string? Notes { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal? DiscountPercent { get; init; }
    public decimal? Discount { get; init; }
    public decimal Subtotal { get; init; }
    public int DisplayOrder { get; init; }
    public int? BuyQuantity { get; init; }
    public int? GetQuantity { get; init; }
    public int Role { get; init; }
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; }
}

public record PromotionDetailItem
{
    public int Id { get; init; }
    public int PromotionId { get; init; }
    public int ItemId { get; init; }
    public int FeeId { get; init; }
    public int TaxId { get; init; }
    public int MeasureId { get; init; }
    public decimal RequiredQuantity { get; init; }
    public decimal PromotionalPrice { get; init; }
    public string? Notes { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal? DiscountPercent { get; init; }
    public decimal? Discount { get; init; }
    public decimal Subtotal { get; init; }
    public int DisplayOrder { get; init; }
    public int? BuyQuantity { get; init; }
    public int? GetQuantity { get; init; }
    public int Role { get; init; }
    public bool IsActive { get; init; }
}
