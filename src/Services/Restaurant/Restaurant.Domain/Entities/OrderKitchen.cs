namespace Restaurant.Domain.Entities;

[Table("OrderKitchen", Schema = "Restaurant")]
public class OrderKitchen : BaseEntity
{
    public required Order Order { get; set; }
    public int OrderId { get; set; }
    public int? ChefId { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal? Progress { get; set; }

    public bool Completed { get; set; } = false;
}
