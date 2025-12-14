namespace Inventory.Domain.Entities;

[Table("SubcategoryPhoto", Schema = "Inventario")]
public class SubcategoryPhoto : BaseEntity
{
  public int SubcategoryId { get; set; }

  [MaxLength(500)] public required string S3ObjectKey { get; set; }

  [MaxLength(800)] public required string S3ObjectUrl { get; set; }

  public bool IsDefault { get; set; }
}
