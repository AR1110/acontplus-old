using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Vet.Core.Entities
{
    [Table("Behavior", Schema = "Pet")]
    public class Behavior : BaseEntity
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
