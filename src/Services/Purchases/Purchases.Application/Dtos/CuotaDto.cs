using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public record CuotaDto
    {
        public int? IdCuotaPorPagar { get; set; }

        public required int NroCuota { get; set; }

        public required DateTime FechaVencimiento { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El valor de la cuota debe ser mayor o igual a cero.")]

        public required decimal Cuota { get; set; }

        public required bool Entrada { get; set; }
    }
}