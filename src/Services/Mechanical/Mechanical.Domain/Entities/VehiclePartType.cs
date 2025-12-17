using Acontplus.Core.Domain.Common.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Domain.Entities;

[Table("VehiclePartType", Schema = "Mechanical")]
public class VehiclePartType : BaseEntity
{
    [MaxLength(15)] public required string Code { get; set; }

    [MaxLength(150)] public required string Description { get; set; }
}
