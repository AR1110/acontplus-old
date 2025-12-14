using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Acontplus.Core.Domain.Common.Entities;

namespace Mechanical.Domain.Entities;

[Table("SupportDocument", Schema = "Mechanical")]
public class SupportDocument : BaseEntity
{
  public Support Support { get; set; }
  public int SupportId { get; set; }
  public int DocumentoId { get; set; }
  public int TipoDocumentoId { get; set; }

  [MaxLength(50)] public required string SeriesVoucher { get; set; }
}
