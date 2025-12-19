namespace Restaurant.Domain.Entities;

[Table("ItemType", Schema = "Restaurant")]
public class ItemType : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }
}
