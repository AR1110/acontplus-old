namespace Purchases.Application.Dtos.NonHabitualPurchases;

public record NonHabitualPurchaseCreate(
    IncomingDocumentDto IncomingDocument,
    List<IncomingDocumentDetailDto> Details,
    int UserRoleId);

public record NonHabitualPurchaseUpdate(
    int Id,
    IncomingDocumentDto IncomingDocument,
    List<IncomingDocumentDetailDto> Details);

public record NonHabitualPurchaseItem(
    int Id,
    IncomingDocumentDto IncomingDocument,
    List<IncomingDocumentDetailDto> Details,
    bool IsActive,
    DateTime CreatedAt);
