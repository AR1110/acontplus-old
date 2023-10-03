using Common.Core.Entities;

namespace TechnicalSupport.Core.Entities
{
    public class ProductCustomer : BaseEntity
    {
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
    }
}
