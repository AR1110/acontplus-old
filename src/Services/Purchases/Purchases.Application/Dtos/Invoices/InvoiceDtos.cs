namespace Purchases.Application.Dtos.Invoices;

public record InvoiceCreate(
    InvoiceReceiptDto Receipt,
    List<IncomingDocumentDetailDto> Documents,
    List<TaxDto> Taxes,
    List<ArticleAdditionalInfoDto> ArticleAdditionalInfo,
    List<InstallmentDto> Installments,
    int UserRoleId);

public record InvoiceUpdate(
    int Id,
    InvoiceReceiptDto Receipt,
    List<IncomingDocumentDetailDto> Documents,
    List<TaxDto> Taxes,
    List<ArticleAdditionalInfoDto> ArticleAdditionalInfo,
    List<InstallmentDto> Installments);

public record InvoiceItem(
    int Id,
    InvoiceReceiptDto Receipt,
    List<IncomingDocumentDetailDto> Documents,
    List<TaxDto> Taxes,
    List<ArticleAdditionalInfoDto> ArticleAdditionalInfo,
    List<InstallmentDto> Installments,
    bool IsActive,
    DateTime CreatedAt);
