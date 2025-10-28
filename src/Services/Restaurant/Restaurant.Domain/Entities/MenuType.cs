namespace Restaurant.Domain.Entities;

[Table("MenuType", Schema = "Restaurant")]
public class MenuType : BaseEntity
{
    [Required][MaxLength(5)] public required string Code { get; set; }

    [Required][MaxLength(100)] public required string Name { get; set; }
}
