namespace Restaurant.Application.Dtos;

public record OrderCreate
{
    public Guid Uuid { get; init; }
    public int EstablecimientoId { get; init; }
    public int PuntoEmisionId { get; init; }
    public int? TableId { get; init; }
    public int Sequence { get; init; }
    public string Serie { get; init; }
    public int CustomerCompanyId { get; init; }
    public decimal? Tax { get; init; }
    public decimal? Discount { get; init; }
    public decimal? Tip { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public bool Divided { get; init; }
    public bool Finished { get; init; }
    public int? TaxPercentId { get; init; }
    public ICollection<OrderDetailCreate>? OrderDetails { get; init; }
}

public record OrderItem
{
    public int Id { get; init; }
    public Guid Uuid { get; init; }
    public int EstablecimientoId { get; init; }
    public int PuntoEmisionId { get; init; }
    public int? TableId { get; init; }
    public int Sequence { get; init; }
    public string Serie { get; init; }
    public int CustomerCompanyId { get; init; }
    public decimal? Tax { get; init; }
    public decimal? Discount { get; init; }
    public decimal? Tip { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public bool Divided { get; init; }
    public bool Finished { get; init; }
    public int? TaxPercentId { get; init; }
    public bool IsActive { get; init; }
    public ICollection<OrderDetailItem>? OrderDetails { get; init; }
}

public record OrderUpdate
{
    public Guid Uuid { get; init; }
    public int EstablecimientoId { get; init; }
    public int PuntoEmisionId { get; init; }
    public int? TableId { get; init; }
    public int Sequence { get; init; }
    public string Serie { get; init; }
    public int CustomerCompanyId { get; init; }
    public decimal? Tax { get; init; }
    public decimal? Discount { get; init; }
    public decimal? Tip { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public bool Divided { get; init; }
    public bool Finished { get; init; }
    public int? TaxPercentId { get; init; }
    public ICollection<OrderDetailUpdate>? OrderDetails { get; init; }
}

public record OrderDetailCreate
{
    public Guid Uuid { get; init; }
    public int OrderId { get; init; }
    public int? MenuId { get; init; }
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
    public Guid Uuid { get; init; }
    public int OrderId { get; init; }
    public int? MenuId { get; init; }
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

public record OrderDetailItem
{
    public int Id { get; init; }
    public Guid Uuid { get; init; }
    public int OrderId { get; init; }
    public int? MenuId { get; init; }
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
