namespace Contabilidad.Domain.Entities;

[Table("Tipo", Schema = "Contabilidad")]
public class Tipo : BaseEntity
{
    [Required][MaxLength(10)] public required string Code { get; set; }

    [Required][MaxLength(150)] public required string Name { get; set; }
}
