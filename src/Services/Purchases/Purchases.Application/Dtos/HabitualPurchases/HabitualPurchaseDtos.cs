namespace Purchases.Application.Dtos.HabitualPurchases;

public record HabitualPurchaseCreate(
    PurchaseBaseDto PurchaseBase,
    List<PurchaseDetailBaseDto> Details,
    int CreatedByUserId);

public record HabitualPurchaseUpdate(
    int Id,
    PurchaseBaseDto PurchaseBase,
    List<PurchaseDetailBaseDto> Details);

public record HabitualPurchaseItem(
    int Id,
    PurchaseBaseDto PurchaseBase,
    List<PurchaseDetailBaseDto> Details,
    bool IsActive,
    DateTime CreatedAt);
