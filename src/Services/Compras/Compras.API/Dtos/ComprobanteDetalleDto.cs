using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record ComprobanteDetalleDto
  {
    public required int OrderIndex { get; set; }

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
    public required decimal Descuento { get; set; }

    [Precision(18, 5)]
    public required decimal PorcentajeDescuento { get; set; }

    [MaxLength(5)]
    public required string CodigoPorcentaje { get; set; }

    [Precision(18, 5)]
    public required decimal Tarifa { get; set; }

    [Precision(18, 5)]
    public required decimal ValorImpuesto { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioTotalSinImpuesto { get; set; }

    [MaxLength(100)]
    public string? Nota { get; set; }

    [MaxLength(255)]
    public required string Descripcion { get; set; }

    public required bool LlevaInventario { get; set; }

    [Precision(18, 5)]
    public required decimal CantidadTransaccion { get; set; }

    [Precision(18, 5)]
    public required decimal Conversion { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioCosto { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioCostoFraccionado { get; set; }

  }
}