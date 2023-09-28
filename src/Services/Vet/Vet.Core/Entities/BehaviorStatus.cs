using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Vet.Core.Entities
{
    [Table("BehaviorStatus", Schema = "Pet")]
    public class BehaviorStatus : BaseEntity
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
