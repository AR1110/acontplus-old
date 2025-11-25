namespace Mechanical.Application.Dtos;

public record CreateSupportDetailDto
{
    public SupportDto Support { get; init; } = new();
    public List<SupportDetailItemDto> SupportDetails { get; init; } = [];
}

public record UpdateSupportDetailDto
{
    public SupportDto Support { get; init; } = new();
    public List<SupportDetailItemDto> SupportDetails { get; init; } = [];
}

public record SupportDto
{
    public int Id { get; init; }
    public decimal Total { get; init; }
    public decimal Discount { get; init; }
}

public record SupportDetailItemDto
{
    public int OrderIndex { get; init; }
    public int Id { get; init; }
    public int ArticuloId { get; init; }
    public int TarifaId { get; init; }
    public int BodegaId { get; init; }
    public int MedidaId { get; init; }
    public int TaxId { get; init; }
    public int TaxPercentId { get; init; }
    public string Description { get; init; }
    public decimal Quantity { get; init; }
    public decimal Price { get; init; }
    public decimal Cost { get; init; }
    public decimal TaxValue { get; init; }
    public decimal Discount { get; init; }
    public decimal Total { get; init; }
    public bool Inventory { get; init; }
    public bool Enabled { get; init; }
    public bool? Deleted { get; init; }
    public string? Obs { get; init; }
}

public record SupportDetailDtos
{
    public CreateSupportDetailDto Create { get; init; } = new();
    public UpdateSupportDetailDto Update { get; init; } = new();
}
