using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Restaurant", Schema = "POS")]
    public class Restaurants : BaseEntity
    {
        [Required]
        [MaxLength(300)]
        public string Name { get; set; }
        [MaxLength(3)]
        public string Estab { get; set; }
        [MaxLength(3)]
        public string PtoEmi { get; set; }
        [MaxLength(300)]
        public string Address { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }
        [MaxLength(15)]
        public string Telephone { get; set; }
        public string Deleted { get; set; }
        public int CompanyId { get; set; }
    }
}
