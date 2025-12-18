namespace Purchases.Application.Dtos.PurchaseOrders;

public record PurchaseOrderCreate(
    ReceiptDto Comprobante,
    List<ReceiptDetailDto> ComprobanteDetalles,
    List<TaxDto> Impuestos,
    int CreatedByUserId);

public record PurchaseOrderUpdate(
    int Id,
    ReceiptDto Comprobante,
    List<ReceiptDetailDto> ComprobanteDetalles,
    List<TaxDto> Impuestos);

public record PurchaseOrderItem(
    int Id,
    ReceiptDto Comprobante,
    List<ReceiptDetailDto> ComprobanteDetalles,
    List<TaxDto> Impuestos,
    bool IsActive,
    DateTime CreatedAt);
