namespace Purchases.Application.DTOs
{
    public record ComprobanteDetalleDto : DetalleBaseDto
    {
        public required int OrderIndex { get; set; }
        public int? IdOrdenCompraDetalle { get; set; }
    }
}