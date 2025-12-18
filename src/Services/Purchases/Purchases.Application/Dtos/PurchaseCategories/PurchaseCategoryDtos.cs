namespace Purchases.Application.Dtos.PurchaseCategories;

public record PurchaseCategoryCreate(
    string Name,
    string? Description,
    int CreatedByUserId);

public record PurchaseCategoryUpdate(
    int Id,
    string Name,
    string? Description,
    bool IsActive);

public record PurchaseCategoryItem(
    int Id,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt);
