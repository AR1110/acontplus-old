namespace Purchases.Application.Dtos.ReceivedDocuments;

public record ReceivedDocumentCreate(
    DocumentoRecibidoComprobanteDto Comprobante,
    string CodEstab,
    int SubCategoryId,
    int CreatedByUserId);

public record ReceivedDocumentUpdate(
    int Id,
    DocumentoRecibidoComprobanteDto Comprobante,
    string CodEstab,
    int SubCategoryId);

public record ReceivedDocumentItem(
    int Id,
    DocumentoRecibidoComprobanteDto Comprobante,
    string CodEstab,
    int SubCategoryId,
    bool IsActive,
    DateTime CreatedAt);

public record ReceivedDocumentMigrate(
    int Id,
    List<int> DocumentIds,
    int CreatedByUserId);

public record ReceivedDocumentCategoryUpdate(
    int Id,
    int SubCategoryId);
