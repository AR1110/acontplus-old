namespace Restaurant.Domain.Entities;

[Table("ProductionArea", Schema = "Restaurant")]
public class ProductionArea : BaseEntity
{
    [Required][MaxLength(5)] public required string Code { get; set; }

    [Required][MaxLength(100)] public required string Description { get; set; }

    public int EstablishmentId { get; set; }
}
