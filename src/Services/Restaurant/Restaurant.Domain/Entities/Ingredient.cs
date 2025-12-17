namespace Restaurant.Domain.Entities;

[Table("Ingredient", Schema = "Restaurant")]
public class Ingredient : BaseEntity
{
    public required int ProductId { get; set; }

    public required IngredientType IngredientType { get; set; }
    public int? IngredientTypeId { get; set; }

    [MaxLength(500)] public string? Summary { get; set; }

    public int? Quantity { get; set; }
    public int? Unit { get; set; }
    public string? Content { get; set; }
}
