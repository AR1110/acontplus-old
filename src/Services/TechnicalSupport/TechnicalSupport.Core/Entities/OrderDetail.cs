
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
        public Device Device { get; set; }
        public int DeviceId { get; set; }
        [MaxLength(500)]
        public string Obs { get; set; }
    }
}
