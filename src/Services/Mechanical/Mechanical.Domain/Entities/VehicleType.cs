using Acontplus.Core.Domain.Common.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Domain.Entities;

[Table("VehicleType", Schema = "Mechanical")]
public class VehicleType : BaseEntity
{
    [MaxLength(8)] public required string Code { get; set; }

    [MaxLength(100)] public required string Description { get; set; }
}
