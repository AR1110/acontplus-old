namespace Purchases.Application.DTOs
{
    public record LiquidacionCompraDto
    {

        public required DocumentIngresoDto DocumentoIngreso { get; set; }

        public required List<DocumentoIngresoDetalleDto> Detalles { get; set; }
        public required List<TaxDto> Impuestos { get; set; }

        public required List<ArticuloInfoAdicionalDto> ArticulosInfoAdicional { get; set; }

        public required List<CuotaDto> Cuotas { get; set; }
    }
}