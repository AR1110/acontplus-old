using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Mechanical.Core.Entities
{
    [Table("VehicleCompany", Schema = "Mechanical")]
    public class VehicleCompany : BaseEntity
    {
        public Vehicle Vehicle { get; set; }
        public int VehicleId { get; set; }
        public int CompanyId { get; set; }
        public int CustomerId { get; set; }

        [MaxLength(300)]
        public string Observation { get; set; }
    }
}
