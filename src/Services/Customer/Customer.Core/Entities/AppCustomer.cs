using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Customer.Core.Entities
{
    [Table("Customer", Schema = "Customer")]
    public class AppCustomer : BaseEntity
    {
        [Required]
        [MaxLength(2)]
        public string IDType { get; set; }
        [Required]
        [MaxLength(15)]
        public string IDCard { get; set; }
        [Required]
        [MaxLength(300)]
        public string BusinessName { get; set; }
        [MaxLength(300)]
        public string TradeName { get; set; }
        [MaxLength(500)]
        public string Address { get; set; }
        public bool IsValid { get; set; }
    }
}
