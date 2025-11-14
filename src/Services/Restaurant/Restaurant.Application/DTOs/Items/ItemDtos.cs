using Restaurant.Application.Dtos;

namespace Restaurant.Application.Dtos.Items;

public record ItemCreate
{
    public int ProductId { get; init; }
    public string? Summary { get; init; }
    public string? PreparationInstructions { get; init; }
    public int MeasureId { get; init; }
    public decimal SalePrice { get; init; }
    public decimal UnitPrice { get; init; }
    public bool RequiresCooking { get; init; }
    public int? PreparationTimeMinutes { get; init; }
    public bool IsAvailableForPromotion { get; init; }
    public bool IsComposite { get; init; }
    public ICollection<ItemCompositionCreate>? Compositions { get; init; }
}

public record ItemUpdate
{
    public string? Summary { get; init; }
    public string? PreparationInstructions { get; init; }
    public int MeasureId { get; init; }
    public decimal SalePrice { get; init; }
    public decimal UnitPrice { get; init; }
    public bool RequiresCooking { get; init; }
    public int? PreparationTimeMinutes { get; init; }
    public bool IsAvailableForPromotion { get; init; }
    public bool IsComposite { get; init; }
    public ICollection<ItemCompositionUpdate>? Compositions { get; init; }
}

public record ItemItem
{
    public int Id { get; init; }
    public int ProductId { get; init; }
    public string? Summary { get; init; }
    public string? PreparationInstructions { get; init; }
    public int MeasureId { get; init; }
    public decimal SalePrice { get; init; }
    public decimal UnitPrice { get; init; }
    public bool RequiresCooking { get; init; }
    public int? PreparationTimeMinutes { get; init; }
    public bool IsAvailableForPromotion { get; init; }
    public bool IsComposite { get; init; }
    public bool IsActive { get; init; }
    public ICollection<ItemCompositionItem>? Compositions { get; init; }
}
