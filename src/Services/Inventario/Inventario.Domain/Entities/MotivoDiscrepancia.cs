namespace Inventario.Domain.Entities;

[Table("MotivoDiscrepancia", Schema = "Inventario")]
public class MotivoDiscrepancia : BaseEntity
{
    [Required][MaxLength(10)] public required string Codigo { get; set; }

    [Required][MaxLength(150)] public required string Descripcion { get; set; }
}
