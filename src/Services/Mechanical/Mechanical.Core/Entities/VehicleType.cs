using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Mechanical.Core.Entities
{
    [Table("VehicleType", Schema = "Mechanical")]
    public class VehicleType : BaseEntity
    {
        [Required]
        [MaxLength(8)]
        public string Code { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
    }
}
