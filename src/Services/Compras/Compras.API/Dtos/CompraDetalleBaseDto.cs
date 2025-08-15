namespace Compras.API.Dtos
{
  public record DetalleBaseDto
  {
    public required int IdArticulo { get; set; }

    public required int IdBodega { get; set; }

    public int? IdMedida { get; set; }

    public required int IdTipoIva { get; set; }

    [Precision(18, 5)]
    public required decimal Ice { get; set; }

    [Precision(18, 5)]
    public required decimal Cantidad { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioUnitario { get; set; }

    [Precision(18, 5)]
    public required decimal PorcentajeDescuento { get; set; }

    public required string CodigoPorcentaje { get; set; }

    [Precision(18, 5)]
    public required decimal Tarifa { get; set; }

    [Precision(18, 5)]
    public required decimal ValorImpuesto { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioTotalSinImpuesto { get; set; }

    public string? Nota { get; set; }

    public required string Descripcion { get; set; }
  }
}