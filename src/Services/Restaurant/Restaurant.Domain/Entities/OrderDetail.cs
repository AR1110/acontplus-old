namespace Restaurant.Domain.Entities;

[Table("OrderDetail", Schema = "Restaurant")]
public class OrderDetail : BaseEntity
{
    public required Order Order { get; set; }
    public int OrderId { get; set; }
    public int ItemId { get; set; }
    public required Item Item { get; set; }
    public int? TaxPercentId { get; set; }
    public int? FeeId { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal? TaxValue { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal Quantity { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal UnitPrice { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal SalePrice { get; set; }
    [Column(TypeName = "decimal(5,2)")] public decimal Discount { get; set; }
    [Column(TypeName = "decimal(5,2)")] public decimal DiscountPercent { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal Subtotal { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal Total { get; set; }
    [MaxLength(1000)] public string? Obs { get; set; }
    public int? WarehouseId { get; set; }
    public int MeasureId { get; set; }
    public bool IsPaid { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal? RemainingQuantity { get; set; }
    public Guid? UniqueId { get; set; }
    public OrderDetailStatus Status { get; set; } = OrderDetailStatus.Pending;
    public ICollection<OrderDetailModifier> Modifiers { get; set; } = [];
    public ICollection<OrderDetailCompositionModifier> ModifiersComposition { get; set; } = [];
}

public enum OrderDetailStatus
{
    Pending = 1,
    SentToKitchen = 2,
    InPreparation = 3,
    Ready = 4,
    Delivered = 5,
    Cancelled = 6
}
