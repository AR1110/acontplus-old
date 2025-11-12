using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.Dtos.Items;

public record ItemUpdate
{
    public string? Summary { get; set; }
    public bool Cooking { get; set; }
    public string? Recipe { get; set; }
    public string? Instructions { get; set; }
    public string? Content { get; set; }
    public int Unit { get; set; }
    public bool ForPromotion { get; set; }
    public int Quantity { get; set; }
    public string? Title { get; set; }
    public bool IsActive { get; set; }
    public ItemComposition[]? ItemComposition { get; set; }
}

public record ItemComposition
{
    public int Id { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "ItemId must be greater than zero.")]
    public int ItemId { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "ChildItemId must be greater than zero.")]
    public int ChildItemId { get; set; }
    public int? ItemCompositionId { get; set; }
    public int? FeeId { get; set; }
    public int? TaxId { get; set; }
    public int MeasureId { get; set; }
    public int? ExtentId { get; set; }

    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Instructions { get; set; }
    public decimal? Weight { get; set; }
    public decimal? NetWeight { get; set; }
    public decimal CostPrice { get; set; }
    public decimal? DiscountPercent { get; set; }
    public decimal? Discount { get; set; }
    public decimal Subtotal { get; set; }
    public decimal? WastePercentage { get; set; }
    public bool IsOptional { get; set; }
    public decimal ExtraCharge { get; set; }
    public string? UniqueId { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
}
