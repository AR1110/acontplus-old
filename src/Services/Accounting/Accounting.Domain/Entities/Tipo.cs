namespace Accounting.Domain.Entities;

[Table("Tipo", Schema = "Contabilidad")]
public class Tipo : BaseEntity
{
    [MaxLength(10)] public required string Code { get; set; }

    [MaxLength(150)] public required string Name { get; set; }
}
