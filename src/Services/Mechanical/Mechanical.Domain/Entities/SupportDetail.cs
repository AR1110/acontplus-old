using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Acontplus.Core.Domain.Common.Entities;

namespace Mechanical.Domain.Entities;

[Table("SupportDetail", Schema = "Mechanical")]
public class SupportDetail : BaseEntity
{
  public Support support { get; set; }
  public int SupportId { get; set; }
  public int ArticuloId { get; set; }
  public int TarifaId { get; set; }
  public int BodegaId { get; set; }
  public int MedidaId { get; set; }
  public int TaxId { get; set; }
  public int TaxPercentId { get; set; }

  [MaxLength(300)] public required string Description { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal Quantity { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal Cost { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal TaxValue { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal Price { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal Discount { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal Total { get; set; }

  [MaxLength(300)] public string Obs { get; set; }
}
