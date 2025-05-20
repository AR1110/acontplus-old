namespace Vet.API.Entities;

[Table("DiseaseStatus", Schema = "Vet")]
public class DiseaseStatus : BaseEntity
{
    [Required] [MaxLength(2)] public string Code { get; set; }

    [Required] [MaxLength(50)] public string Name { get; set; }

    [MaxLength(100)] public string Description { get; set; }

    public int? Order { get; set; }
}