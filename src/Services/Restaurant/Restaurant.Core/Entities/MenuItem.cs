using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("MenuItem", Schema = "Restaurant")]
    public class MenuItem : BaseEntity
    {
        public Menu Menu { get; set; }
        public int MenuId { get; set; }
        public Item Item { get; set; }
        public int FeeId { get; set; }
        public int ItemId { get; set; }
        [Column(TypeName = "numeric(18,5)")]
        public decimal? Quantity { get; set; }
        [Column(TypeName = "numeric(18,5)")]
        public decimal? DiscountPercent { get; set; }
        [Column(TypeName = "numeric(18,5)")]
        public decimal? DiscountValue { get; set; }
        [Column(TypeName = "numeric(18,5)")]
        public decimal? Subtotal { get; set; }
    }
}
