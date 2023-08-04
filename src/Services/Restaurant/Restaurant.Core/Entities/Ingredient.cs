using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Ingredient", Schema = "Restaurant")]
    public class Ingredient : BaseEntity
    {
        public int ProductId { get; set; }
        [MaxLength(500)]
        public string Summary { get; set; }
        public int TypeId { get; set; }
        public int Quantity { get; set; }
        public int Unit { get; set; }
        public string Content { get; set; }
    }
}