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
        public float? Weight { get; set; }
        public float NetWeight { get; set; }
    }
}
