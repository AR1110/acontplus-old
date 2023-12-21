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
    }
}
