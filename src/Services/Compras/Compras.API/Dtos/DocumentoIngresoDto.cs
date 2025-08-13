using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record DocumentIngresoDto
  {
    public int? IdDocumentoIngreso { get; set; }

    public int? IdPuntoEmision { get; set; }

    [Required]
    public int IdProveedor { get; set; }

    public int? IdTiempoCredito { get; set; }

    [MaxLength(5, ErrorMessage = "El código no puede exceder los 5 caracteres.")]
    public string Codigo { get; set; }

    [Required]
    public DateTime FechaEmision { get; set; }

    [Required]
    public DateTime FechaVencimiento { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal TotalSinImpuestos { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal PorcentajeDescuento { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal Descuento { get; set; }

    [Required]
    [Precision(18, 5)]
    public decimal ImporteTotal { get; set; }

    [MaxLength(300)]
    public string Observacion { get; set; }

    public int? SubcategoryId { get; set; }
  }
}