namespace Restaurant.Domain.Entities;

[Table("OrderDetailModifier", Schema = "Restaurant")]
public class OrderDetailModifier : BaseEntity
{
    public required int OrderDetailId { get; set; }
    public required OrderDetail OrderDetail { get; set; }

    public required int ModifierItemId { get; set; }
    public required Item ModifierItem { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal Quantity { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal ExtraCharge { get; set; }

    public ModifierAction Action { get; set; }

    [MaxLength(500)] public string? Instructions { get; set; }

    public Guid? UniqueId { get; set; }
}

public enum ModifierAction
{
    Add = 1, // Agregar (ej: extra queso)
    Remove = 2, // Quitar (ej: sin cebolla)
    Replace = 3 // Reemplazar (ej: cambiar papas por ensalada)
}
