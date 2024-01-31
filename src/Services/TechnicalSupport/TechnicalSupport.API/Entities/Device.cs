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
        [Required]
        [MaxLength(300)]
        public string Serie { get; set; }
        [MaxLength(300)]
        public string Brand { get; set; }
        [MaxLength(300)]
        public string Model { get; set; }
        public int? Year { get; set; }
        [Column(TypeName = "numeric(18,2), not null")]
        public decimal? Warranty { get; set; }
        [MaxLength(100)]
        public string Color { get; set; }
        public string Specs { get; set; }
        public List<DeviceCustomer> Customers { get; set; }
    }
}
