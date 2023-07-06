using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("Pet", Schema = "Pet")]
    public class Pet : BaseEntity
    {
        public int CustomerId { get; set; } 
        public int CompanyId { get; set; }
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