using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mechanical.Core.Entities
{
    [Table("Inspection", Schema = "Mechanical")]
    public class Inspection : BaseEntity
    {
        public Support support { get; set; }
        public int SupportId { get; set; }
        public DateTime Date { get; set; }
        public int Mileage { get; set; }
        [Required]
        public string Engine { get; set; }
        [Required]
        public string Transmission { get; set; }
        [Required]
        public string Brake { get; set; }
        [Required]
        public string Steering { get; set; }
        [Required]
        public string Suspension { get; set; }
        [Required]
        [MaxLength(300)]
        public string Obs { get; set; }
        public int CompanyId { get; set; }
        public int UserId { get; set; }
    }
}
