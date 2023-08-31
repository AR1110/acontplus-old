using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Core.Entities
{
    [Table("Vehicle", Schema = "Mechanical")]
    public class Vehicle : BaseEntity
    {

        public VehicleType VehicleType { get; set; }
        public int VehicleTypeId { get; set; }

        public int CountryId { get; set; }

        [Required]
        [MaxLength(10)]
        public string LicensePlate { get; set; }

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; }


        [MaxLength(100)]
        public string Model { get; set; }

        public int Year { get; set; }

        [Required]
        [MaxLength(100)]
        public string Color { get; set; }

        [Required]
        [MaxLength(100)]
        public string Engine { get; set; }

        [Required]
        [MaxLength(150)]
        public string Chassis { get; set; }

        [MaxLength(150)]
        public string Cylindraje { get; set; }

    }
}
