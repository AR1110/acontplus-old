using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Recipe", Schema = "Restaurant")]
    public class Dish : BaseEntity
    {
        public int ProductId { get; set; }
        public ProductionArea ProductionArea { get; set; }
        public int ProductionAreaId { get; set; }
    }
}
