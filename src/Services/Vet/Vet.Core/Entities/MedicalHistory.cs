using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("MedicalHistory", Schema = "Pet")]
    public class MedicalHistory : BaseEntity
    {
        [Required]
        public DateTime Date { get; set; }
        public Pet Pet { get; set; }
        public int PetId { get; set; }
        [MaxLength(300)]
        public string Observations { get; set; }
        public List<HealthCheck> HealthChecks { get; set; }
        public List<BehaviorTest> BehaviorTests { get; set; }
        [MaxLength(15)]
        public string CodEstab { get; set; }
        public int? UserId { get; set; }
    }
}