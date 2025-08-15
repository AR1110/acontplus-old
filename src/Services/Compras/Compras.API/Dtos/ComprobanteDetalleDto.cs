namespace Compras.API.Dtos
{
  public record ComprobanteDetalleDto : DetalleBaseDto
  {
    public required int OrderIndex { get; set; }
    public int? IdOrdenCompraDetalle { get; set; }
  }
}