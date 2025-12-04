namespace Restaurant.Domain.Entities;

[Table("IngredientType", Schema = "Restaurant")]
public class IngredientType : BaseEntity
{
    [Required][MaxLength(5)] public required string Code { get; set; }

    [Required][MaxLength(100)] public required string Name { get; set; }
}
