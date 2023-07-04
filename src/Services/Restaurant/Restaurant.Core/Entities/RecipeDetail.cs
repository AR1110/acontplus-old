using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("RecipeDetail", Schema = "POS")]
    public class RecipeDetail: BaseEntity
    {
        public int ProductId { get; set; }
        public int RecipeId { get; set; }
        [Required]
        [MaxLength(200)]

        public string Name { get; set; }

        public virtual Recipe Recipe { get; set; }
    }
}
