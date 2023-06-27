using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("PetBreed", Schema = "Pet")]
    public class PetBreed : BaseEntity
    {

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [Required]
        [MaxLength(300)]
        public string Description { get; set; }
        public int Deleted { get; set; }
    }
}