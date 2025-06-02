namespace Restaurant.Domain.Entities;

[Table("ProductionArea", Schema = "Restaurant")]
public class ProductionArea : BaseEntity
{
    [Required][MaxLength(5)] public string Code { get; set; }

    [Required][MaxLength(100)] public string Description { get; set; }

    public int EstablecimientoId { get; set; }
}