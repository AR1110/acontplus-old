using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("Pet", Schema = "Pet")]
    public class Pet : BaseEntity
    {
        [Required]
        [MaxLength(25)]
        public string ClientUniqueId { get; set; }
        [Required]
        [MaxLength(25)]
        public string CompanyUniqueId { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
        public virtual PetType PetType { get; set; }
        public int? PetTypeId { get; set; }
        public virtual PetBreed PetBreed { get; set; }
        public int? PetBreedId { get; set; }
        public virtual PetSex PetSex { get; set; }
        public int? PetSexId { get; set; }
        [Required]
        [MaxLength(50)]
        public string Color { get; set; }
        public DateTime? Birthdate { get; set; }
        public int? Deleted { get; set; }
    }
}