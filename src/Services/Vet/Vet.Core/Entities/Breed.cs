using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("Breed", Schema = "Pet")]
    public class Breed : BaseEntity
    {
        public PetType PetType { get; set; }
        public int? PetTypeId { get; set; }
        [Required]
        [MaxLength(2)]
        public string Code { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
    }
}