namespace Inventory.Domain.Entities;

[Table("MotivoDiscrepancia", Schema = "Inventario")]
public class MotivoDiscrepancia : BaseEntity
{
    [MaxLength(10)] public required string Codigo { get; set; }

    [MaxLength(150)] public required string Descripcion { get; set; }
}
