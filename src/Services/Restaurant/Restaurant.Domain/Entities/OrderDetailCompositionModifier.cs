namespace Restaurant.Domain.Entities;

[Table("OrderDetailCompositionModifier", Schema = "Restaurant")]
public class OrderDetailCompositionModifier : BaseEntity
{
  public required int OrderDetailId { get; set; }
  public required OrderDetail OrderDetail { get; set; }
  public required int ModifierCompositionId { get; set; }
  public required ItemComposition ModifierComposition { get; set; }
  [Column(TypeName = "decimal(18,5)")] public decimal Quantity { get; set; }
  [Column(TypeName = "decimal(18,5)")] public decimal ExtraCharge { get; set; }
  [MaxLength(500)] public string? Instructions { get; set; }
  public Guid? UniqueId { get; set; }
}
