namespace Vet.Domain.Entities;

[Table("HealthCheck", Schema = "Vet")]
public class HealthCheck : BaseEntity
{
    public required MedicalHistory MedicalHistory { get; set; }
    public int MedicalHistoryId { get; set; }
    public required Disease Disease { get; set; }
    public int DiseaseId { get; set; }
    public required DiseaseStatus DiseaseStatus { get; set; }
    public int DiseaseStatusId { get; set; }
}
