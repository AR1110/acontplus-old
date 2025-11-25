namespace Purchases.Application.DTOs
{
    public record CompraNoHabitualDto
    {
        public required DocumentIngresoDto DocumentIngreso { get; set; }

        public required List<DocumentoIngresoDetalleDto> ComprobantesDetalles { get; set; }

        public required List<TaxDto> Impuestos { get; set; }

        public required ArticuloInfoAdicionalDto ArticuloInfoAdicional { get; set; }

        public required List<CuotaDto> Cuotas { get; set; }
    }
}