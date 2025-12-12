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
    public bool IsQuickSale { get; init; }

    public int CreatedByUserId { get; init; }
    public ICollection<OrderDetailCreate>? OrderDetails { get; init; } 
    public ICollection<OrderDetailCompositionModifierCreate>? OrderDetailCompositionModifiers { get; init; }

    public OrderDocumentDataDto? DataDoc { get; init; }
}
//Temp name OrderItemDto - to be changed to OrderItem
public record OrderItemDto
{
    public int Id { get; init; }
    public int PuntoEmisionId { get; init; }
    public string? Serie { get; init; }
    public decimal? Discount { get; init; }
    public decimal? Tip { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public bool IsDivided { get; init; }
    public bool IsFinished { get; init; }
    public bool IsActive { get; init; }
    public string? CreatedByUser { get; init; }
    public string? Table { get; init; }
    public string? CreatedAt { get; init; }
    public required string IdCard { get; init; }
    public required string BusinessName { get; init; }
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
    public bool IsQuickSale { get; init; }
    public ICollection<OrderDetailUpdate> OrderDetails { get; init; }
    public ICollection<OrderDetailCompositionModifierUpdate>? OrderDetailCompositionModifiers { get; init; }

    public OrderDocumentDataDto? DataDoc { get; init; }
}

public record OrderCancel
{
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; }
    public string? Obs { get; init; }
}
