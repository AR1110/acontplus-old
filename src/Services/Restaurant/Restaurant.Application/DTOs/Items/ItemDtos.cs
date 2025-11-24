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
    public bool IsActive { get; init; }
    public ICollection<ItemCompositionUpdate>? Compositions { get; init; }
}

public record ItemItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Summary { get; set; } = string.Empty;
    public bool RequiresCooking { get; set; }
    public string? PreparationInstructions { get; set; }
    public string? ImagenUrl { get; set; }
    public string? Description { get; set; }
    public string? Code { get; set; }
    public string? Measure { get; set; }
    public string? AuxiliaryCode { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal? PriceWithTax { get; set; }
    public string? Category { get; set; }
    public string? AcronymFamily { get; set; }
    public ICollection<ItemCompositionItem>? Compositions { get; init; }
}
