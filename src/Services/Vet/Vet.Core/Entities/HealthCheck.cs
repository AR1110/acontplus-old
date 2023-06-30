using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("HealthCheck", Schema = "Pet")]
    public class HealthCheck : BaseEntity
    {
        public MedicalHistory PetService { get; set; }
        public int PetServiceId { get; set; }
        public Disease Disease { get; set; }
        public int DiseaseId { get; set; }
        public DiseaseStatus DiseaseStatus { get; set; }
        public int DiseaseStatusId { get; set; }
    }
}