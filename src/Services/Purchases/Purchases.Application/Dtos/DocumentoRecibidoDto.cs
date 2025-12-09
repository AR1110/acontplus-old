using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public class DocumentoRecibidoDto
    {
        public required DocumentoRecibidoComprobanteDto Comprobante { get; set; }

        [MaxLength(50)]
        public required string CodEstab { get; set; }

        public required int SubCategoryId { get; set; }
    }
}