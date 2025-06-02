namespace Vet.API.Entities;

[Table("Breed", Schema = "Vet")]
public class Breed : BaseEntity
{
    public PetType PetType { get; set; }
    public int PetTypeId { get; set; }

    [Required][MaxLength(5)] public string Code { get; set; }

    [Required][MaxLength(100)] public string Name { get; set; }

    [MaxLength(500)] public string Description { get; set; }
}