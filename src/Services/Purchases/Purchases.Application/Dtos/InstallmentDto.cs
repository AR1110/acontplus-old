using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public record InstallmentDto
    {
        public int? PayableInstallmentId { get; set; }

        public required int InstallmentNumber { get; set; }

        public required DateTime DueDate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El valor de la cuota debe ser mayor o igual a cero.")]

        public required decimal InstallmentAmount { get; set; }

        public required bool IsDownPayment { get; set; }
    }
}
