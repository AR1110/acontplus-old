using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("Device", Schema = "TechnicalSupport")]
public class Device : BaseEntity
{
    [Required][MaxLength(300)] public string Name { get; set; }

    public required Modelo Modelo { get; set; }
    public int ModeloId { get; set; }

    [MaxLength(100)] public string? Color { get; set; }

    public ICollection<DeviceCustomer> Customers { get; set; } = new List<DeviceCustomer>();
    public DeviceSpecs Specs { get; set; }
}
