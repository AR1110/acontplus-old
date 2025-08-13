using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record DocumentIngresoDto
  {
    public int? IdDocumentoIngreso { get; set; }

    public int? IdPuntoEmision { get; set; }

    public required int IdProveedor { get; set; }

    public int? IdTiempoCredito { get; set; }

    [MaxLength(5, ErrorMessage = "El código no puede exceder los 5 caracteres.")]
    public string? Codigo { get; set; }

    public required DateTime FechaEmision { get; set; }

    public required DateTime FechaVencimiento { get; set; }

    [Precision(18, 5)]
    public required decimal TotalSinImpuestos { get; set; }

    [Precision(18, 5)]
    public required decimal PorcentajeDescuento { get; set; }

    [Precision(18, 5)]
    public required decimal Descuento { get; set; }

    [Precision(18, 5)]
    public required decimal ImporteTotal { get; set; }

    [MaxLength(300)]
    public string? Observacion { get; set; }

    public int? SubcategoryId { get; set; }
  }
}