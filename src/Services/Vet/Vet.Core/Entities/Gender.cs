using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Vet.Core.Entities
{
    [Table("Gender", Schema = "Pet")]
    public class Gender : BaseEntity
    {
        [Required]
        [MaxLength(2)]
        public string Code { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(300)]
        public string Description { get; set; }
    }
}
