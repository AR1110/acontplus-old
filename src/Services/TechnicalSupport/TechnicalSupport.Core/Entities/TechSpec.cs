using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.Core.Entities
{
    [Table("TechSpec", Schema = "TechnicalSupport")]
    public class TechSpec : BaseEntity
    {
        public Device Device { get; set; }
        public int DeviceId { get; set; }
        [Required]
        public string Specs { get; set; }
    }
}
