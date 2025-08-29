using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("DeviceSpecs", Schema = "TechnicalSupport")]
public class DeviceSpecs : BaseEntity
{
    public required Device Device { get; set; }
    public int DeviceId { get; set; }

    [Required] public required string Specs { get; set; }
}
