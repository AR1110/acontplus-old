using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.API.Entities
{
    [Table("OrderMaintenance", Schema = "TechnicalSupport")]
    public class OrderMaintenance : BaseEntity
    {
        public OrderDetail OrderDetail { get; set; }
        public int OrderDetailId { get; set; }
        public int ProductId { get; set; }
    }
}
