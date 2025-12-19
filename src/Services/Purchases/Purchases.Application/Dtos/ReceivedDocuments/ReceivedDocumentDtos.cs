namespace Purchases.Application.Dtos.ReceivedDocuments;

public record ReceivedDocumentCreate(
    string AccessKey,
    int EstablishmentId,
    int SubcategoryId,
    int CreatedByUserId);

// Internal model for file processing with retry tracking
public record ReceivedDocumentFileMessage(
    string AccessKey,
    int EstablishmentId,
    int SubcategoryId,
    int CreatedByUserId,
    int DocumentId,
    int RetryCount = 0,
    DateTime? LastRetryAt = null,
    string? LastError = null);

public record ReceivedDocumentUpdate(
    int Id,
    ReceivedDocumentReceiptDto Receipt,
    int EstablishmentId,
    int SubcategoryId);

public record ReceivedDocumentItem(
    int Id,
    string AccessKey,
    int EstablishmentId,
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
