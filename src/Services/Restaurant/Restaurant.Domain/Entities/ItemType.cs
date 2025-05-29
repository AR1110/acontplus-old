namespace Restaurant.Domain.Entities;

[Table("ItemType", Schema = "Restaurant")]
public class ItemType : BaseEntity
{
    [Required][MaxLength(5)] public string Code { get; set; }

    [Required][MaxLength(100)] public string Name { get; set; }
}