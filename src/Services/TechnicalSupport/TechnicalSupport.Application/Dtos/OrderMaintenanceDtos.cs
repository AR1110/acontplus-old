namespace TechnicalSupport.Application.Dtos;

public record CreateOrderMaintenanceDto
{
    public OrderDto Order { get; init; } = new();
    public List<OrderMaintenanceDetailDto> Detalles { get; init; } = [];
}

public record UpdateOrderMaintenanceDto
{
    public OrderDto Order { get; init; } = new();
    public List<OrderMaintenanceDetailDto> Detalles { get; init; } = [];
}

public record OrderDto
{
    public int Id { get; init; }
    public int BodegaId { get; init; }
    public DateTime FechaEmision { get; init; }
    public int EstablecimientoId { get; init; }
    public int CustomerCompanyId { get; init; }
    public decimal PercentageDiscount { get; init; }
    public decimal SubTotalSinImpuesto { get; init; }
    public string CodDoc { get; init; }
    public decimal Tax { get; init; }
    public decimal Tip { get; init; }
    public decimal Total { get; init; }
    public int PuntoEmisionId { get; init; }
    public decimal Discount { get; init; }
}

public record OrderMaintenanceDetailDto
{
    public string RowGuid { get; init; }
    public int Id { get; init; }
    public string Descripcion { get; init; }
    public int OrderIndex { get; init; }
    public int BodegaId { get; init; }
    public int OrderDetailId { get; init; }
    public string Codigo { get; init; }
    public decimal CostoFraccionado { get; init; }
    public decimal PrecioConIva { get; init; }
    public decimal PrecioTotalSinImpuesto { get; init; }
    public int FeeId { get; init; }
    public int MedidaId { get; init; }
    public int ProductId { get; init; }
    public int TaxId { get; init; }
    public int TaxPercentId { get; init; }
    public decimal Quantity { get; init; }
    public decimal Cost { get; init; }
    public decimal TaxValue { get; init; }
    public decimal Price { get; init; }
    public decimal Discount { get; init; }
    public decimal PercentageDiscount { get; init; }
    public decimal Total { get; init; }
    public string? Obs { get; init; }
    public decimal Conversion { get; init; }
    public decimal CantidadTransaccion { get; init; }
    public bool EnvioSri { get; init; }
    public bool? IsGroup { get; init; }
}
