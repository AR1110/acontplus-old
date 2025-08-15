using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record CompraBaseDto
  {
    public required int IdProveedor { get; set; }

    public int? IdTiempoCredito { get; set; }

    public required DateTime FechaEmision { get; set; }

    [Precision(18, 5)]
    public required decimal TotalSinImpuestos { get; set; }

    [Precision(18, 5)]
    public required decimal PorcentajeDescuento { get; set; }

    [Precision(18, 5)]
    public required decimal ImporteTotal { get; set; }

    [MaxLength(300, ErrorMessage = "La observación no puede exceder los 300 caracteres.")]
    public string? Observacion { get; set; }

  }
}