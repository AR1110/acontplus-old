namespace Purchases.Application.Dtos.NonHabitualPurchases;

public record NonHabitualPurchaseCreate(
    IncomingDocumentDto DocumentoIngreso,
    List<IncomingDocumentDetailDto> Detalles,
    int CreatedByUserId);

public record NonHabitualPurchaseUpdate(
    int Id,
    IncomingDocumentDto DocumentoIngreso,
    List<IncomingDocumentDetailDto> Detalles);

public record NonHabitualPurchaseItem(
    int Id,
    IncomingDocumentDto DocumentoIngreso,
    List<IncomingDocumentDetailDto> Detalles,
    bool IsActive,
    DateTime CreatedAt);
