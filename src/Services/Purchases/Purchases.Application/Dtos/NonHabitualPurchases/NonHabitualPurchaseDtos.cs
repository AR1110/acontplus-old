namespace Purchases.Application.Dtos.NonHabitualPurchases;

public record NonHabitualPurchaseCreate : BaseDto
{
    public ICollection<IncomingDocumentDetailDto> Details { get; init; } = [];
}

public record NonHabitualPurchaseUpdate : BaseDto
{
    public int Id { get; init; }
    public ICollection<IncomingDocumentDetailDto> Details { get; init; } = [];
}

public record NonHabitualPurchaseItem : BaseDto
{
    public int Id { get; init; }
    public ICollection<IncomingDocumentDetailDto> Details { get; init; } = [];
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
};
