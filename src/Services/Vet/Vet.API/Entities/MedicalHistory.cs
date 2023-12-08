using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Vet.API.Entities
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
        [Column(TypeName = "numeric(4,2), null")]
        public decimal? Age { get; set; }
        [Column(TypeName = "numeric(4,2), null")]
        public decimal? Weight { get; set; }
    }
}
