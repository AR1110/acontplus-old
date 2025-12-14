using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Acontplus.Core.Domain.Common.Entities;

namespace Mechanical.Domain.Entities;

[Table("VehiclePart", Schema = "Mechanical")]
public class VehiclePart : BaseEntity
{
  public VehiclePartType vehiclePartType { get; set; }
  public int VehiclePartTypeId { get; set; }

  [MaxLength(15)] public required string Code { get; set; }

  [MaxLength(200)] public required string Description { get; set; }
}
