namespace Purchases.Application.Dtos.NonHabitualPurchases;

public record NonHabitualPurchaseCreate(
    DocumentIngresoDto DocumentoIngreso,
    List<DocumentoIngresoDetalleDto> Detalles,
    int CreatedByUserId);

public record NonHabitualPurchaseUpdate(
    int Id,
    DocumentIngresoDto DocumentoIngreso,
    List<DocumentoIngresoDetalleDto> Detalles);

public record NonHabitualPurchaseItem(
    int Id,
    DocumentIngresoDto DocumentoIngreso,
    List<DocumentoIngresoDetalleDto> Detalles,
    bool IsActive,
    DateTime CreatedAt);
