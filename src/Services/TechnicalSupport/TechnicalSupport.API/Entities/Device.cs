using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.API.Entities
{
    [Table("Device", Schema = "TechnicalSupport")]
    public class Device : BaseEntity
    {
        [Required]
        [MaxLength(300)]
        public string Name { get; set; }
        public Modelo Modelo { get; set; }
        public int ModeloId { get; set; }
        public int? Year { get; set; }
        [MaxLength(100)]
        public string Color { get; set; }
        public List<DeviceCustomer> Customers { get; set; }
        public DeviceSpecs Specs { get; set; }
    }
}
