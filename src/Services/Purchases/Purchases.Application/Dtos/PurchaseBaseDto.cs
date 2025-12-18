using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
  public record PurchaseBaseDto
  {
    public required int IdProveedor { get; set; }

    public int? IdTiempoCredito { get; set; }

    public required DateTime FechaEmision { get; set; }


    public required decimal TotalSinImpuestos { get; set; }


    public required decimal PorcentajeDescuento { get; set; }


    public required decimal ImporteTotal { get; set; }

    [MaxLength(300, ErrorMessage = "La observación no puede exceder los 300 caracteres.")]
    public string? Observacion { get; set; }

  }
}
