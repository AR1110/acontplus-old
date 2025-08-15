namespace Compras.API.Dtos
{
  public record OrdenCompraDto : CompraBaseDto
  {
    public int? IdPuntoEmision { get; set; }

    [Precision(18, 5)]
    public required decimal SubTotalSinImpuestos { get; set; }

    [Precision(18, 5)]
    public required decimal TotalDescuento { get; set; }

    [Precision(18, 5)]
    public required decimal Propina { get; set; }

    [Precision(18, 5)]
    public required decimal Recargo { get; set; }

    [Precision(18, 5)]
    public required decimal Transporte { get; set; }

    [Precision(18, 5)]
    public required decimal Total { get; set; }
  }
}