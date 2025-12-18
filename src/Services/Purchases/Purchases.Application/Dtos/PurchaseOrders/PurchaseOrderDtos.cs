namespace Purchases.Application.Dtos.PurchaseOrders;

public record PurchaseOrderCreate(
    ComprobanteDto Comprobante,
    List<ComprobanteDetalleDto> ComprobanteDetalles,
    List<TaxDto> Impuestos,
    int CreatedByUserId);

public record PurchaseOrderUpdate(
    int Id,
    ComprobanteDto Comprobante,
    List<ComprobanteDetalleDto> ComprobanteDetalles,
    List<TaxDto> Impuestos);

public record PurchaseOrderItem(
    int Id,
    ComprobanteDto Comprobante,
    List<ComprobanteDetalleDto> ComprobanteDetalles,
    List<TaxDto> Impuestos,
    bool IsActive,
    DateTime CreatedAt);
