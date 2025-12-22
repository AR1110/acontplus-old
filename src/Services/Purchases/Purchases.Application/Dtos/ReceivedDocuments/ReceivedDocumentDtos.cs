namespace Purchases.Application.Dtos.ReceivedDocuments;

public record ReceivedDocumentCreate(
    string AccessKey,
    int EstablishmentId,
    int SubcategoryId,
    int UserRoleId);

// Internal model for file processing with retry tracking
public record ReceivedDocumentFileMessage(
    string AccessKey,
    int EstablishmentId,
    int SubcategoryId,
    int UserRoleId,
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
    int EstablishmentId,
    int SubcategoryId,
    string SubcategoryName,
    string DocumentType,
    string DocumentCode,
    decimal TotalAmount,
    string AccessKey,
    DateTime IssueDate,
    DateTime AuthorizationDate,
    string IssuerBusiness,
    bool IsProcessed);

public record ReceivedDocumentMigrate(
    int Id,
    List<int> DocumentIds,
    int UserRoleId);

public record ReceivedDocumentCategoryUpdate(
    int Id,
    int SubcategoryId);
