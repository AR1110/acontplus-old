namespace Purchases.Application.Dtos.ReceivedDocuments;

public record ReceivedDocumentCreate(
    ReceivedDocumentReceiptDto Receipt,
    string EstablishmentCode,
    int SubcategoryId,
    int CreatedByUserId);

public record ReceivedDocumentUpdate(
    int Id,
    ReceivedDocumentReceiptDto Receipt,
    string EstablishmentCode,
    int SubcategoryId);

public record ReceivedDocumentItem(
    int Id,
    ReceivedDocumentReceiptDto Receipt,
    string EstablishmentCode,
    int SubcategoryId,
    bool IsActive,
    DateTime CreatedAt);

public record ReceivedDocumentMigrate(
    int Id,
    List<int> DocumentIds,
    int CreatedByUserId);

public record ReceivedDocumentCategoryUpdate(
    int Id,
    int SubcategoryId);
