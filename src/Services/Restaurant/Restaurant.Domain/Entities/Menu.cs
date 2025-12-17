namespace Restaurant.Domain.Entities;

[Table("Menu", Schema = "Restaurant")]
public class Menu : BaseEntity
{
    public int ProductId { get; set; }

    [MaxLength(500)] public required string Title { get; set; }

    [MaxLength(500)] public string? Summary { get; set; }

    public MenuType? MenuType { get; set; }
    public int? MenuTypeId { get; set; }
    public string? Content { get; set; }
    public bool ForPromotion { get; set; }
    public ICollection<MenuItem> MenuItems { get; set; } = [];
}
