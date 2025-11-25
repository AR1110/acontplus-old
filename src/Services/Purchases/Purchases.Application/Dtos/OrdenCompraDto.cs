namespace Purchases.Application.DTOs
{
    public record OrdenCompraDto
    {
        public required ComprobanteDto Comprobante { get; set; }
        public required List<ComprobanteDetalleDto> ComprobanteDetalles { get; set; }
        public required List<TaxDto> Impuestos { get; set; }
    }
}