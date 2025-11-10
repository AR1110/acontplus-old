namespace Restaurant.Domain.Entities;

[Table("Recipe", Schema = "Restaurant")]
public class Recipe : BaseEntity
{
    public required Item Item { get; set; }
    public int ItemId { get; set; }
    public required Ingredient Ingredient { get; set; }
    public int IngredientId { get; set; }
    public double Quantity { get; set; }
    public int Unit { get; set; }
    public string? Instructions { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Weight { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal NetWeight { get; set; }

    public int ExtentId { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? CostPrice { get; set; }
}
