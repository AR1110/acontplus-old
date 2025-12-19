namespace Vet.Domain.Entities;

[Table("DiseaseStatus", Schema = "Vet")]
public class DiseaseStatus : BaseEntity
{
    [MaxLength(2)] public required string Code { get; set; }

    [MaxLength(50)] public required string Name { get; set; }

    [MaxLength(100)] public string? Description { get; set; }

    public int? Order { get; set; }
}
