namespace Vet.Domain.Entities;

[Table("Disease", Schema = "Vet")]
public class Disease : BaseEntity
{
    public DiseaseType? DiseaseType { get; set; }
    public int? DiseaseTypeId { get; set; }

    [Required][MaxLength(5)] public required string Code { get; set; }

    [Required][MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }
}
