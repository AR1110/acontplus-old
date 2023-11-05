using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Restaurant.Core.Entities
{
    [Table("Ingredient", Schema = "Restaurant")]
    public class Ingredient : BaseEntity
    {
        [Required]
        public int ProductId { get; set; }
        public IngredientType IngredientType { get; set; }
        public int? IngredientTypeId { get; set; }
        [MaxLength(500)]
        public string Summary { get; set; }
        public int? Quantity { get; set; }
        public int? Unit { get; set; }
        public string Content { get; set; }
    }
}
