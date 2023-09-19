using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Core.Entities
{

    [Table("VehiclePartType", Schema = "Mechanical")]
    public class VehiclePartType : BaseEntity
    {
        [Required]
        [MaxLength(15)]
        public string Code { get; set; }

        [Required]
        [MaxLength(150)]
        public string Description { get; set; }
    }
}
