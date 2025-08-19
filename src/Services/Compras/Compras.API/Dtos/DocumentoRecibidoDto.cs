using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public class DocumentoRecibidoDto
  {
    public required DocumentoRecibidoComprobanteDto Comprobante { get; set; }

    [MaxLength(50)]
    public required string CodEstab { get; set; }

    public required int SubCategoryId { get; set; }
  }
}