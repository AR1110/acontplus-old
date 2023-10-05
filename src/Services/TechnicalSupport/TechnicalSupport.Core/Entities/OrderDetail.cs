
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.Core.Entities
{
    [Table("OrderDetail", Schema = "TechnicalSupport")]
    public class OrderDetail : BaseEntity
    {
        public Guid Uuid { get; set; }
        public Order Order { get; set; }
        public int OrderId { get; set; }
        public Device Product { get; set; }
        public int ProductId { get; set; }
        public int? TaxId { get; set; }
        public int? TaxPercentId { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal? TaxValue { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Quantity { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Cost { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Price { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal Discount { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Total { get; set; }
        [MaxLength(500)]
        public string Obs { get; set; }
        public int FeeId { get; set; }
    }
}
