namespace Purchases.Application.Dtos.PurchaseInvoices;

public record PurchaseInvoiceCreate(
    PurchaseInvoiceReceiptDto Comprobante,
    List<IncomingDocumentDetailDto> Documentos,
    List<TaxDto> Impuestos,
    List<ArticleAdditionalInfoDto> ArticulosInfoAdicional,
    List<InstallmentDto> Cuotas,
    int CreatedByUserId);

public record PurchaseInvoiceUpdate(
    int Id,
    PurchaseInvoiceReceiptDto Comprobante,
    List<IncomingDocumentDetailDto> Documentos,
    List<TaxDto> Impuestos,
    List<ArticleAdditionalInfoDto> ArticulosInfoAdicional,
    List<InstallmentDto> Cuotas);

public record PurchaseInvoiceItem(
    int Id,
    PurchaseInvoiceReceiptDto Comprobante,
    List<IncomingDocumentDetailDto> Documentos,
    List<TaxDto> Impuestos,
    List<ArticleAdditionalInfoDto> ArticulosInfoAdicional,
    List<InstallmentDto> Cuotas,
    bool IsActive,
    DateTime CreatedAt);
