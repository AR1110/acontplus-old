namespace Purchases.Application.Dtos.HabitualPurchases;

public record HabitualPurchaseCreate(
    BaseDto PurchaseBase,
    List<DetailBaseDto> Details,
    int UserRoleId);

public record HabitualPurchaseUpdate(
    int Id,
    BaseDto PurchaseBase,
    List<DetailBaseDto> Details);

public record HabitualPurchaseItem(
    int Id,
    BaseDto PurchaseBase,
    List<DetailBaseDto> Details,
    bool IsActive,
    DateTime CreatedAt);
