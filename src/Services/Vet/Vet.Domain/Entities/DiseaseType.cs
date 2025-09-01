namespace Vet.Domain.Entities;

[Table("DiseaseType", Schema = "Vet")]
public class DiseaseType : BaseEntity
{
    [Required][MaxLength(5)] public required string Code { get; set; }

    [Required][MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }
}
