using Common.Core.Entities;

namespace TechnicalSupport.Core.Entities
{
    public class OrderMaintenance : BaseEntity
    {
        public OrderDetail OrderDetail { get; set; }
        public int OrderDetailId { get; set; }
        public int ProductId { get; set; }
    }
}
