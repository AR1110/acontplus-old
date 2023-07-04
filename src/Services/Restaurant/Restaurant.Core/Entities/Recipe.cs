using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Recipe", Schema = "Restaurant")]
    public class Recipe : BaseEntity
    {
        public Dish Dish { get; set; }
        public int DishId { get; set; }
        //Ingredient Id
        public int ProductId { get; set; } 
        public float? Weight { get; set; }
        public float NetWeight { get; set; }
    }
}
