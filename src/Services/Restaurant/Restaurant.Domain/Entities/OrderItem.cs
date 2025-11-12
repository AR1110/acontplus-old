namespace Restaurant.Domain.Entities;

[Table("OrderItem", Schema = "Restaurant")]
public class OrderItem : BaseEntity
{
    public Guid Uuid { get; set; }
    public required Order Order { get; set; }
    public int OrderId { get; set; }
    public Menu? Menu { get; set; }
    public int? MenuId { get; set; }
    public int ItemId { get; set; }
    public required Item Item { get; set; }
    public int? TaxPercentId { get; set; }
    public int? FeeId { get; set; }
    [Column(TypeName = "numeric(18,5), not null")]
    public decimal? TaxValue { get; set; }
    [Column(TypeName = "numeric(18,5), not null")]
    public decimal Quantity { get; set; }
    [Column(TypeName = "numeric(18,5), not null")]
    public decimal UnitPrice { get; set; }
    [Column(TypeName = "numeric(18,5), not null")]
    public decimal SalePrice { get; set; }
    [Column(TypeName = "numeric(5,2), null")]
    public decimal Discount { get; set; }
    [Column(TypeName = "numeric(5,2), null")]
    public decimal DiscountPercent { get; set; }
    [Column(TypeName = "numeric(18,5), not null")]
    public decimal Subtotal { get; set; }
    [Column(TypeName = "numeric(18,5), not null")]
    public decimal Total { get; set; }
    [MaxLength(1000)]
    public string? Obs { get; set; }
    public int? WarehouseId { get; set; }
    public int MeasureId { get; set; }
    public bool IsPaid { get; set; }
    [Column(TypeName = "numeric(18,5), null")]
    public decimal? RemainingQuantity { get; set; }
    public OrderItemStatus Status { get; set; } = OrderItemStatus.Pending;
    public ICollection<OrderItemModifier> Modifiers { get; set; } = [];
}

public enum OrderItemStatus
{
    Pending = 1,
    SentToKitchen = 2,
    InPreparation = 3,
    Ready = 4,
    Delivered = 5,
    Cancelled = 6
}
