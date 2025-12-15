namespace Vet.Domain.Entities;

[Table("Breed", Schema = "Vet")]
public class Breed : BaseEntity
{
    public required PetType PetType { get; set; }
    public int PetTypeId { get; set; }

    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }
}
