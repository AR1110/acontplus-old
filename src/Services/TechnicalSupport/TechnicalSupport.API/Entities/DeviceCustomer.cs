using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.API.Entities
{
    [Table("DeviceCustomer", Schema = "TechnicalSupport")]
    public class DeviceCustomer : BaseEntity
    {
        public Device Device { get; set; }
        public int DeviceId { get; set; }
        public int CustomerCompanyId { get; set; }
        [Required]
        [MaxLength(300)]
        public string SerialNumber { get; set; }
        public DateTime? WarrantyStartDate { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
    }
}
