using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Vet.API.Entities
{
    [Table("DiseaseStatus", Schema = "Pet")]
    public class DiseaseStatus : BaseEntity
    {
        [Required]
        [MaxLength(2)]
        public string Code { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [MaxLength(100)]
        public string Description { get; set; }
        public int? Order { get; set; }
    }
}
