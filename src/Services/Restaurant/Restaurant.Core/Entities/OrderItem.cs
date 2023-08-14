using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("OrderItem", Schema = "Restaurant")]
    public class OrderItem : BaseEntity
    {
        public Order Order { get; set; }
        public int OrderId { get; set; }
        public Item Item { get; set; }
        public int ItemId { get; set; }
        public int? TaxId { get; set; }
        public int? TaxPercentId { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal? TaxValue { get; set; }
        public float Quantity { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Cost { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Price { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal Discount { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Total { get; set; }
    }
}