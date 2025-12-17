namespace Restaurant.Domain.Entities;

[Table("ItemComposition", Schema = "Restaurant")]
public class ItemComposition : BaseEntity
{
    // PADRE: Item que CONTIENE (Menú o Plato elaborado)
    public required int ParentItemId { get; set; }
    public required Item ParentItem { get; set; }

    // HIJO: Item que ES CONTENIDO (Plato, Bebida o Ingrediente)
    public required int ChildItemId { get; set; }
    public required Item ChildItem { get; set; }

    // Cantidad requerida del componente hijo
    [Column(TypeName = "decimal(18,5)")] public decimal Quantity { get; set; }

    // Costo unitario al momento de la composición
    [Column(TypeName = "decimal(18,5)")] public decimal UnitPrice { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal SalePrice { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal TotalCost { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal TotalPrice { get; set; }

    [Column(TypeName = "decimal(5,2)")] public decimal? WastePercentage { get; set; }

    public int MeasureId { get; set; }

    // Opcionalidad (para menús personalizables)
    public bool IsOptional { get; set; }
    public bool IsDefault { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal? ExtraCharge { get; set; }

    // Orden de preparación/visualización
    public int DisplayOrder { get; set; }

    // Nivel de composición (1=directo, 2=indirecto)
    public int CompositionLevel { get; set; } = 1;
    [MaxLength(300)] public string? Notes { get; set; }
    public Guid? UniqueId { get; set; }
    public int? ParentCompositionId { get; set; }
    public ItemComposition? ParentComposition { get; set; }
    public ICollection<ItemComposition> Children { get; set; } = [];

    public int? FeeId { get; set; }
}
