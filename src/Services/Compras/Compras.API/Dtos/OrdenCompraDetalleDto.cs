namespace Compras.API.Dtos
{
  public record OrdenCompraDetalleDto : DetalleBaseDto
  {
    public required int OrderIndex { get; set; }
    public int? IdOrdenCompraDetalle { get; set; }

    public required decimal ValorDescuento { get; set; }

    public bool? Estado { get; set; } = true;
  }
}