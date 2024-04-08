using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.API.Entities
{
    [Table("DeviceSpecs", Schema = "TechnicalSupport")]
    public class DeviceSpecs : BaseEntity
    {
        public Device Device { get; set; }
        public int DeviceId { get; set; }
        [Required]
        public string Specs { get; set; }
    }
}
