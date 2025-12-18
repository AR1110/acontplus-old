namespace Purchases.Application.Dtos.PurchaseInvoices;

public record PurchaseInvoiceCreate(
    FacturaCompraComprobanteDto Comprobante,
    List<DocumentoIngresoDetalleDto> Documentos,
    List<TaxDto> Impuestos,
    List<ArticuloInfoAdicionalDto> ArticulosInfoAdicional,
    List<CuotaDto> Cuotas,
    int CreatedByUserId);

public record PurchaseInvoiceUpdate(
    int Id,
    FacturaCompraComprobanteDto Comprobante,
    List<DocumentoIngresoDetalleDto> Documentos,
    List<TaxDto> Impuestos,
    List<ArticuloInfoAdicionalDto> ArticulosInfoAdicional,
    List<CuotaDto> Cuotas);

public record PurchaseInvoiceItem(
    int Id,
    FacturaCompraComprobanteDto Comprobante,
    List<DocumentoIngresoDetalleDto> Documentos,
    List<TaxDto> Impuestos,
    List<ArticuloInfoAdicionalDto> ArticulosInfoAdicional,
    List<CuotaDto> Cuotas,
    bool IsActive,
    DateTime CreatedAt);
