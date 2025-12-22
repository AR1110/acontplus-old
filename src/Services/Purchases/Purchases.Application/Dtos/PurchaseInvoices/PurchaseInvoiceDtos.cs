namespace Purchases.Application.Dtos.PurchaseInvoices;

public record PurchaseInvoiceCreate(
    PurchaseInvoiceReceiptDto Receipt,
    List<IncomingDocumentDetailDto> Documents,
    List<TaxDto> Taxes,
    List<ArticleAdditionalInfoDto> ArticleAdditionalInfo,
    List<InstallmentDto> Installments,
    int UserRoleId);

public record PurchaseInvoiceUpdate(
    int Id,
    PurchaseInvoiceReceiptDto Receipt,
    List<IncomingDocumentDetailDto> Documents,
    List<TaxDto> Taxes,
    List<ArticleAdditionalInfoDto> ArticleAdditionalInfo,
    List<InstallmentDto> Installments);

public record PurchaseInvoiceItem(
    int Id,
    PurchaseInvoiceReceiptDto Receipt,
    List<IncomingDocumentDetailDto> Documents,
    List<TaxDto> Taxes,
    List<ArticleAdditionalInfoDto> ArticleAdditionalInfo,
    List<InstallmentDto> Installments,
    bool IsActive,
    DateTime CreatedAt);
