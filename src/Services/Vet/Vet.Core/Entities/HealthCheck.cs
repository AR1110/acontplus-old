using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("HealthCheck", Schema = "Pet")]
    public class HealthCheck : BaseEntity
    {
        public MedicalHistory MedicalHistory { get; set; }
        public int MedicalHistoryId { get; set; }
        public Disease Disease { get; set; }
        public int DiseaseId { get; set; }
        public DiseaseStatus DiseaseStatus { get; set; }
        public int DiseaseStatusId { get; set; }
    }
}