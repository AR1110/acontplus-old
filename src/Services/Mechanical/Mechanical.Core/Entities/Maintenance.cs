using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Core.Entities
{
    [Table("Maintenance", Schema = "Mechanical")]
    public class Maintenance : BaseEntity
    {
        public Support support { get; set; }
        public int SupportId { get; set; }

        public DateTime Date { get; set; }
        public DateTime DateEnd { get; set; }
        public int Mileage { get; set; }
        public string Carbody { get; set; }
        public string Suspension { get; set; }
        public string Steering { get; set; }
        public string Transmission { get; set; }

    }
}
