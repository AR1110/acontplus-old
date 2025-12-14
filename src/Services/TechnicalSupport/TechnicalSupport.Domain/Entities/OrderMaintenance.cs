using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("OrderMaintenance", Schema = "TechnicalSupport")]
public class OrderMaintenance : BaseEntity
{
  public int BodegaId { get; set; }
  public int FeeId { get; set; }
  public int MedidaId { get; set; }

  [MaxLength(300)] public required string Descripcion { get; set; }

  public required OrderDetail OrderDetail { get; set; }
  public int OrderDetailId { get; set; }
  public int ProductId { get; set; }
  public int TaxId { get; set; }
  public int TaxPercentId { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public decimal Quantity { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public decimal Cost { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public decimal TaxValue { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public decimal Price { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public decimal Discount { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public decimal Total { get; set; }

  [MaxLength(300)] public string? Obs { get; set; }
}
