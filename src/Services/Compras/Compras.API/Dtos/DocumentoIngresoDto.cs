namespace Compras.API.Dtos
{
  public record DocumentIngresoDto : CompraBaseDto
  {
    public int? IdDocumentoIngreso { get; set; }

    public int? IdPuntoEmision { get; set; }

    public required DateTime FechaVencimiento { get; set; }

    [Precision(18, 5)]
    public required decimal Descuento { get; set; }

    public int? SubcategoryId { get; set; }
  }
}