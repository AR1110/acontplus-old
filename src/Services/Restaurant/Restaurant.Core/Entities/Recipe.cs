using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Recipe", Schema = "POS")]
    public class Recipe : BaseEntity
    {
        public int ProductId { get; set; }
        [Required]
        [MaxLength(300)]
        public string Name { get; set; }
        [Required]
        [MaxLength(500)]
        public string Description { get; set; }
        public string ImageUrl { get; set; }
    }
}
