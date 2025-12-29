namespace Purchases.Application.Dtos.NonHabitualPurchases;

public record NonHabitualPurchaseCreate : PurchaseBaseDto
{
    public ICollection<IncomingDocumentDetailDto> Details { get; init; } = [];
    public int UserRoleId { get; init; }
}

public record NonHabitualPurchaseUpdate : PurchaseBaseDto
{
    public int Id { get; init; }
    public ICollection<IncomingDocumentDetailDto> Details { get; init; } = [];
}

public record NonHabitualPurchaseItem : PurchaseBaseDto
{
    public int Id { get; init; }
    public ICollection<IncomingDocumentDetailDto> Details { get; init; } = [];
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
};
