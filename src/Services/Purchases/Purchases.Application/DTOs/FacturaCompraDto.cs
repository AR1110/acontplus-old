namespace Purchases.Application.DTOs
{
    public record FacturaCompraDto
    {
        public required FacturaCompraComprobanteDto Comprobante { get; init; }
        public required List<DocumentoIngresoDetalleDto> Documentos { get; init; }

        public required List<TaxDto> Impuestos { get; init; }

        public required List<ArticuloInfoAdicionalDto> ArticulosInfoAdicional { get; init; }

        public required List<CuotaDto> Cuotas { get; init; }
    }
}