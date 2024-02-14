using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Mechanical.API.Entities
{
    [Table("Inspection", Schema = "Mechanical")]
    public class Inspection : BaseEntity
    {
        public Support support { get; set; }
        public int SupportId { get; set; }
        public DateTime Date { get; set; }
        public int Mileage { get; set; }

        [Required]
        [MaxLength(150)]
        public string FuelLevel { get; set; }

        [Required]
        public string Engine { get; set; }

        [Required]
        public string Cabin { get; set; }

        [Required]
        public string Bearing { get; set; }

        [Required]
        public string Transmission { get; set; }

        [Required]
        public string Lighting { get; set; }

        [Required]
        public string Brake { get; set; }

        [Required]
        public string Steering { get; set; }

        [Required]
        public string Suspension { get; set; }

        [MaxLength(300)]
        public string Obs { get; set; }
        public int CompanyId { get; set; }
        public int Status { get; set; } = 0;
    }
}
