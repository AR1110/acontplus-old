using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record CuotaDto
  {
    public int? IdCuotaPorPagar { get; set; }

    public required int NroCuota { get; set; }

    public required DateTime FechaVencimiento { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "El valor de la cuota debe ser mayor o igual a cero.")]
    [Precision(18, 5)]
    public required decimal Cuota { get; set; }

    public required bool Entrada { get; set; }
  }
}