namespace Purchases.Application.Dtos.Orders;

public record OrderCreate(
    ReceiptDto Receipt,
    List<ReceiptDetailDto> ReceiptDetails,
    List<TaxDto> Taxes,
    int UserRoleId);

public record OrderUpdate(
    int Id,
    ReceiptDto Receipt,
    List<ReceiptDetailDto> ReceiptDetails,
    List<TaxDto> Taxes);

public record OrderItem(
    int Id,
    ReceiptDto Receipt,
    List<ReceiptDetailDto> ReceiptDetails,
    List<TaxDto> Taxes,
    bool IsActive,
    DateTime CreatedAt);
