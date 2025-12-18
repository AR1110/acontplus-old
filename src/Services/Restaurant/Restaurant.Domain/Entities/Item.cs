namespace Restaurant.Domain.Entities;

[Table("Item", Schema = "Restaurant")]
public class Item : BaseEntity
{
    public required int ProductId { get; set; }

    [MaxLength(500)] public string? Summary { get; set; }

    // Producción
    [MaxLength(1000)] public string? PreparationInstructions { get; set; }

    public int MeasureId { get; set; }

    // Pricing
    [Column(TypeName = "decimal(18,5)")] public decimal SalePrice { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal UnitPrice { get; set; } // Suma de costos de composiciones

    // Producción
    public bool RequiresCooking { get; set; }

    public int? PreparationTimeMinutes { get; set; }

    // Flags
    public bool IsAvailableForPromotion { get; set; }
    public bool IsComposite { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = []; //Legacy property, may be removed in future

    // Navegación multinivel: cuando ESTE item CONTIENE otros
    public ICollection<ItemComposition> Compositions { get; set; } = [];

    // Navegación multinivel: cuando ESTE item ES USADO EN otros
    public ICollection<ItemComposition> UsedInCompositions { get; set; } = [];
    public ICollection<PromotionDetail> PromotionDetails { get; set; } = [];
    public ICollection<ItemProductionArea> ItemProductionAreas { get; set; } = [];
}
