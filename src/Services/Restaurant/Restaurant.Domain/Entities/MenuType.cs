namespace Restaurant.Domain.Entities;

[Table("MenuType", Schema = "Restaurant")]
public class MenuType : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }
}
