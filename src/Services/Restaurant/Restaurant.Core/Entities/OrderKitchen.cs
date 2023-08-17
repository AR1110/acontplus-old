using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("OrderKitchen", Schema = "Restaurant")]
    public class OrderKitchen : BaseEntity
    {
        public Order Order { get; set; }
        public int OrderId { get; set; }
        public int? ChefId { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal? Progress { get; set; }
        public bool Completed { get; set; } = false;
    }
}
