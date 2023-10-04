using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.Core.Entities
{
    [Table("ProductCustomer", Schema = "TechnicalSupport")]
    public class ProductCustomer : BaseEntity
    {
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public int CustomerCompanyId { get; set; }
    }
}
