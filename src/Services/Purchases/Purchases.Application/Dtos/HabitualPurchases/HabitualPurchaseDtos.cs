namespace Purchases.Application.Dtos.HabitualPurchases;

public record HabitualPurchaseCreate(
    PurchaseBaseDto CompraBase,
    List<PurchaseDetailBaseDto> Detalles,
    int CreatedByUserId);

public record HabitualPurchaseUpdate(
    int Id,
    PurchaseBaseDto CompraBase,
    List<PurchaseDetailBaseDto> Detalles);

public record HabitualPurchaseItem(
    int Id,
    PurchaseBaseDto CompraBase,
    List<PurchaseDetailBaseDto> Detalles,
    bool IsActive,
    DateTime CreatedAt);
