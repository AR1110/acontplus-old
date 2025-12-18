namespace Vet.Domain.Entities;

[Table("PetType", Schema = "Vet")]
public class PetType : BaseEntity
{
    [MaxLength(2)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(300)] public string? Description { get; set; }
}
