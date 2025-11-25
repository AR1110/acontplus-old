namespace Restaurant.Application.Dtos.Order;

public record OrderCreate
{
    public int PuntoEmisionId { get; init; }
    public int? TableId { get; init; }
    public int CustomerCompanyId { get; init; }
    public decimal? Discount { get; init; }
    public decimal? Tip { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public bool IsDivided { get; init; }
    public bool IsFinished { get; init; }
    public ICollection<OrderDetailCreate>? OrderDetails { get; init; }
}
//Temp name OrderItemDto - to be changed to OrderItem
public record OrderItemDto
{
    public int Id { get; init; }
    public int PuntoEmisionId { get; init; }
    public int? TableId { get; init; }
    public int Sequence { get; init; }
    public string? Serie { get; init; }
    public int CustomerCompanyId { get; init; }
    public decimal? Discount { get; init; }
    public decimal? Tip { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public bool IsDivided { get; init; }
    public bool IsFinished { get; init; }
    public bool IsActive { get; init; }
    public ICollection<OrderDetailItem>? OrderDetails { get; init; }
}

public record OrderUpdate
{
    public int PuntoEmisionId { get; init; }
    public int? TableId { get; init; }
    public int CustomerCompanyId { get; init; }
    public decimal? Discount { get; init; }
    public decimal? Tip { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public bool IsDivided { get; init; }
    public bool IsFinished { get; init; }
    public ICollection<OrderDetailUpdate>? OrderDetails { get; init; }
}

public record OrderCancel
{
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; }
    public string? Obs { get; init; }
}
