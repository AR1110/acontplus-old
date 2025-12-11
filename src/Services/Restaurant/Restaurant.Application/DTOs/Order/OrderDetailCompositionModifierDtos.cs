public record OrderDetailCompositionModifierCreate
{
    public int ModifierCompositionId { get; set; }
    public decimal Quantity { get; set; }
    public decimal ExtraCharge { get; set; }
    public string? Instructions { get; set; }
    public string UniqueId { get; init; }
}

public record OrderDetailCompositionModifierUpdate
{
    public int Id { get; init; }
    public int OrderDetailId { get; init; }
    public int ModifierCompositionId { get; set; }
    public decimal Quantity { get; set; }
    public string UniqueId { get; init; }
    public decimal ExtraCharge { get; set; }
    public string? Instructions { get; set; }
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; }
}
