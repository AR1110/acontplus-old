using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.API.Entities
{
    [Table("DeviceCustomer", Schema = "TechnicalSupport")]
    public class DeviceCustomer : BaseEntity
    {
        public Device Device { get; set; }
        public int DeviceId { get; set; }
        public int CustomerCompanyId { get; set; }
        [Required]
        [MaxLength(100)]
        public string SerialNumber { get; set; }
        [Column(TypeName = "numeric(18,2), not null")]
        public decimal? Warranty { get; set; }
    }
}
