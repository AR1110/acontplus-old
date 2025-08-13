using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record CuotaDto
  {
    public int? IdCuotaPorPagar { get; set; }

    [Key]
    [Required]
    public int NroCuota { get; set; }

    [Required]
    public DateTime FechaVencimiento { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "El valor de la cuota debe ser mayor o igual a cero.")]
    [Precision(18, 5)]
    public decimal Cuota { get; set; }

    [Required]
    public bool Entrada { get; set; }

  }
}