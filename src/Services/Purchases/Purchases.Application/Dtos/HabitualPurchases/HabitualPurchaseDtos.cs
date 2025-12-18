namespace Purchases.Application.Dtos.HabitualPurchases;

public record HabitualPurchaseCreate(
    CompraBaseDto CompraBase,
    List<DetalleBaseDto> Detalles,
    int CreatedByUserId);

public record HabitualPurchaseUpdate(
    int Id,
    CompraBaseDto CompraBase,
    List<DetalleBaseDto> Detalles);

public record HabitualPurchaseItem(
    int Id,
    CompraBaseDto CompraBase,
    List<DetalleBaseDto> Detalles,
    bool IsActive,
    DateTime CreatedAt);
