namespace Restaurant.Application.Dtos;

public record CreateOrderDto(
    Guid Uuid,
    List<CreateOrderItemDto> Items,
    int EstablecimientoId,
    int PuntoEmisionId,
    int TableId,
    int CustomerCompanyId,
    decimal Tax,
    decimal Discount,
    decimal Tip,
    decimal Total,
    string? Obs,
    bool QuickSale,
    int BodegaId,
    int UserId
);

public record CreateOrderItemDto(
    Guid Uuid,
    string ItemTypeCode,
    int? MenuId,
    int? ItemId,
    int TaxId,
    int TaxPercentId,
    int FeeId,
    decimal TaxValue,
    decimal Quantity,
    decimal Cost,
    decimal Price,
    decimal Discount,
    decimal Total,
    string? Obs,
    int BodegaId,
    int MedidaId
);

public record UpdateOrderDto(
    Guid Uuid,
    List<UpdateOrderItemDto> Items,
    string? Taxes,
    int EstablecimientoId,
    int PuntoEmisionId,
    int TableId,
    int CustomerCompanyId,
    decimal Tax,
    decimal Discount,
    decimal Total,
    string? Obs,
    bool? SaveDoc,
    bool? UpdateOrder,
    int UserId,
    string? CustomDetail
);

public record UpdateOrderItemDto(
    int OrderItemId,
    Guid Uuid,
    int? ItemId,
    int? MenuId,
    int TaxId,
    int TaxPercentId,
    int FeeId,
    decimal TaxValue,
    decimal Quantity,
    decimal Cost,
    decimal Price,
    decimal Discount,
    decimal Total,
    string? Obs,
    int? BodegaId,
    string ItemTypeCode,
    int MedidaId
);
