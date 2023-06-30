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
        public virtual Breed Breed { get; set; }
        public int? BreedId { get; set; }
        public virtual Gender Gender { get; set; }
        public int? GenderId { get; set; }
        public double Age { get; set; }
        [Required]
        [MaxLength(50)]
        public string Color { get; set; }
        public DateTime? Birthdate { get; set; }
    }
}