namespace Purchases.Application.Dtos.PurchaseOrders;

public record PurchaseOrderCreate(
    ReceiptDto Receipt,
    List<ReceiptDetailDto> ReceiptDetails,
    List<TaxDto> Taxes,
    int CreatedByUserId);

public record PurchaseOrderUpdate(
    int Id,
    ReceiptDto Receipt,
    List<ReceiptDetailDto> ReceiptDetails,
    List<TaxDto> Taxes);

public record PurchaseOrderItem(
    int Id,
    ReceiptDto Receipt,
    List<ReceiptDetailDto> ReceiptDetails,
    List<TaxDto> Taxes,
    bool IsActive,
    DateTime CreatedAt);
