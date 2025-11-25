namespace Restaurant.Domain.Entities;

[Table("ItemType", Schema = "Restaurant")]
public class ItemType : BaseEntity
{
    [Required] [MaxLength(5)] public required string Code { get; set; }

    [Required] [MaxLength(100)] public required string Name { get; set; }
}
