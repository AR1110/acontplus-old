using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Vet.API.Entities
{
    [Table("DiseaseType", Schema = "Pet")]
    public class DiseaseType : BaseEntity
    {
        [Required]
        [MaxLength(5)]
        public string Code { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
    }
}
