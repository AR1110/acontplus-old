using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Core.Entities
{
    [Table("VehiclePart", Schema = "Mechanical")]
    public class VehiclePart :BaseEntity
    {
        public VehiclePartType vehiclePartType {  get; set; }
        public int VehiclePartTypeId { get; set; }
        [Required]
        [MaxLength(15)]
        public string Code { get; set; }

        [Required]
        [MaxLength(200)]
        public string Description { get; set; }


    }
}
