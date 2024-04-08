using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.API.Entities
{
    [Table("Device", Schema = "TechnicalSupport")]
    public class Device : BaseEntity
    {
        public Category Category { get; set; }
        public int CategoryId { get; set; }
        [Required]
        [MaxLength(300)]
        public string Name { get; set; }
        [MaxLength(300)]
        public string Brand { get; set; }
        [MaxLength(300)]
        public string Model { get; set; }
        public int? Year { get; set; }
        [MaxLength(100)]
        public string Color { get; set; }
        public List<DeviceCustomer> Customers { get; set; }
        public DeviceSpecs Specs { get; set; }
    }
}
