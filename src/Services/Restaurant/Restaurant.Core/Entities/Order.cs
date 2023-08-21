using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Order", Schema = "Restaurant")]
    public class Order : BaseEntity
    {
        public int EstablecimientoId { get; set; }
        public int PuntoEmisionId { get; set; }
        public AppTable AppTable { get; set; }
        public int? TableId { get; set; }
        public int Sequence { get; set; }
        [Required]
        [MaxLength(18)]
        public string Serie { get; set; }
        public int CustomerCompanyId { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal? Tax { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal? Discount { get; set; }
        [Column(TypeName = "numeric(18,5), null")]
        public decimal? Tip { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Total { get; set; }
        [MaxLength(500)]
        public string Obs { get; set; }
        public List<OrderItem> OrderItems { get; set; }
    }
}
