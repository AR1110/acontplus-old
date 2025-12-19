using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("Device", Schema = "TechnicalSupport")]
public class Device : BaseEntity
{
    [MaxLength(300)] public required string Name { get; set; }

    public required Modelo Modelo { get; set; }
    public int ModeloId { get; set; }

    [MaxLength(100)] public string? Color { get; set; }

    public ICollection<DeviceCustomer> Customers { get; set; } = [];
    public required DeviceSpecs Specs { get; set; }
}
