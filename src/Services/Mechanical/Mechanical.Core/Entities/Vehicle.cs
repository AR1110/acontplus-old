using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mechanical.Core.Entities
{
    [Table("Vehicle", Schema = "Mechanical")]
    public class Vehicle : BaseEntity
    {

        public VehicleType VehicleType { get; set; }
        public int VehicleTypeId { get; set; }

        [Required]
        [MaxLength(10)]
        public string LicensePlate { get; set; }

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; }

        [Required]
        [MaxLength(100)]
        public string Model { get; set; }

        public int Year { get; set; }

        [MaxLength(100)]
        public string Color { get; set; }

    }
}
