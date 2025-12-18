namespace Inventory.Domain.Entities;

[Table("ProductPhoto", Schema = "Inventario")]
public class ProductPhoto : BaseEntity
{
    public int ProductId { get; set; }

    [MaxLength(500)] public required string S3ObjectKey { get; set; }

    [MaxLength(800)] public required string S3ObjectUrl { get; set; }

    public bool IsDefault { get; set; }
}
