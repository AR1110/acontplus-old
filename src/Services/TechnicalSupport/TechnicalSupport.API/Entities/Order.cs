using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.API.Entities
{
    [Table("Order", Schema = "TechnicalSupport")]
    public class Order : BaseEntity
    {
        public Guid Uuid { get; set; }
        public DateTime FechaEmision { get; set; }
        public int EstablecimientoId { get; set; }
        public int PuntoEmisionId { get; set; }
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
        public decimal? Total { get; set; }
        [MaxLength(500)]
        public string Obs { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public int OrderStatusId { get; set; }
        public List<OrderDetail> OrderDetails { get; set; }
    }
}
