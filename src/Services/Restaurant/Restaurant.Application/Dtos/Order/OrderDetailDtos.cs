namespace Restaurant.Application.Dtos.Order;

public record OrderDetailCreate
{
    public int OrderId { get; init; }
    public int ItemId { get; init; }
    public int? TaxPercentId { get; init; }
    public int? FeeId { get; init; }
    public decimal? TaxValue { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal SalePrice { get; init; }
    public decimal Discount { get; init; }
    public decimal DiscountPercent { get; init; }
    public decimal Subtotal { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public int? WarehouseId { get; init; }
    public int MeasureId { get; init; }
    public bool IsPaid { get; init; }
    public decimal? RemainingQuantity { get; init; }
    public int Status { get; init; }
}

public record OrderDetailUpdate
{
    
    public int Id { get; init; }
    public int OrderId { get; init; }
    public int ItemId { get; init; }
    public int? TaxPercentId { get; init; }
    public int? FeeId { get; init; }
    public decimal? TaxValue { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal SalePrice { get; init; }
    public decimal Discount { get; init; }
    public decimal DiscountPercent { get; init; }
    public decimal Subtotal { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public int? WarehouseId { get; init; }
    public int MeasureId { get; init; }
    public bool IsPaid { get; init; }
    public decimal? RemainingQuantity { get; init; }
    public int Status { get; init; }
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; }
}

public record OrderDetailItem
{
    public int Id { get; init; }
    public int OrderId { get; init; }
    public int ItemId { get; init; }
    public int? TaxPercentId { get; init; }
    public int? FeeId { get; init; }
    public decimal? TaxValue { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal SalePrice { get; init; }
    public decimal Discount { get; init; }
    public decimal DiscountPercent { get; init; }
    public decimal Subtotal { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public int? WarehouseId { get; init; }
    public int MeasureId { get; init; }
    public bool IsPaid { get; init; }
    public decimal? RemainingQuantity { get; init; }
    public int Status { get; init; }
    public bool IsActive { get; init; }
}
