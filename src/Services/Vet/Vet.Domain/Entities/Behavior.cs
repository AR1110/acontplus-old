namespace Vet.Domain.Entities;

[Table("Behavior", Schema = "Vet")]
public class Behavior : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }
}
