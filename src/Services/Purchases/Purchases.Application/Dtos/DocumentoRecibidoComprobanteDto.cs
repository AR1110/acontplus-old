using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public record DocumentoRecibidoComprobanteDto
    {
        [MaxLength(50)]
        public required string Comprobante { get; set; }

        [MaxLength(50)]
        public required string SerieComprobante { get; set; }

        [MaxLength(15)]
        public required string RucEmisor { get; set; }

        [MaxLength(50)]
        public required string RazonSocialEmisor { get; set; }

        public required string FechaEmision { get; set; }

        public required string FechaAutorizacion { get; set; }

        [MaxLength(15)]
        public required string IdentificacionReceptor { get; set; }

        [MaxLength(50)]
        public required string ClaveAcceso { get; set; }

        [MaxLength(50)]
        public required string NumeroAutorizacion { get; set; }

        public required string ImporteTotal { get; set; }
    }
}