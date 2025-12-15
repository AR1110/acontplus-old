using Acontplus.Core.Domain.Common.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Domain.Entities;

[Table("VehicleCompany", Schema = "Mechanical")]
public class VehicleCompany : BaseEntity
{
    public required Vehicle Vehicle { get; set; }
    public int VehicleId { get; set; }
    public int CompanyId { get; set; }
    public int CustomerId { get; set; }

    [MaxLength(300)] public string? Observation { get; set; }
}
