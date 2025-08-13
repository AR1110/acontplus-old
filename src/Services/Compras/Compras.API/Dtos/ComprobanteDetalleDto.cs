using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record ComprobanteDetalleDto
  {
    [Required]
    public int OrderIndex { get; set; }

    [Required]
    public int IdArticulo { get; set; }

    [Required]
    public int IdBodega { get; set; }

    public int? IdMedida { get; set; }

    [Required]
    public int IdTipoIva { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal Ice { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal Cantidad { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal PrecioUnitario { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal Descuento { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal PorcentajeDescuento { get; set; }

    [Required]
    [MaxLength(5)]
    public string CodigoPorcentaje { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal Tarifa { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal ValorImpuesto { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal PrecioTotalSinImpuesto { get; set; }

    [MaxLength(100)]
    public string Nota { get; set; }

    [Required]
    [MaxLength(255)]
    public string Descripcion { get; set; }

    [Required]
    public bool LlevaInventario { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal CantidadTransaccion { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal Conversion { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal PrecioCosto { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal PrecioCostoFraccionado { get; set; }

  }
}