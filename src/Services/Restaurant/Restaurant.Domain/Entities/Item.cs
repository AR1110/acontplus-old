namespace Restaurant.Domain.Entities;

[Table("Item", Schema = "Restaurant")]
public class Item : BaseEntity
{
    public int ProductId { get; set; }
    [MaxLength(500)] public string? Summary { get; set; }
    public bool Cooking { get; set; }
    public string? Recipe { get; set; }
    public string? Instructions { get; set; }
    [MaxLength(500)] public string? Content { get; set; }
    public int? Quantity { get; set; }
    public int? Unit { get; set; }
    public bool? ForPromotion { get; set; }
    [MaxLength(500)] public string? Title { get; set; }
}
