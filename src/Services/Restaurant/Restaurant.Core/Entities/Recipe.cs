using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Recipe", Schema = "Restaurant")]
    public class Recipe : BaseEntity
    {
        public Item Item { get; set; }
        public int ItemId { get; set; }
        public Ingredient Ingredient { get; set; }
        public int IngredientId { get; set; }
        public double Quantity { get; set; }
        public int Unit { get; set; }
        public string Instructions { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal? Weight { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal NetWeight { get; set; }
    }
}
