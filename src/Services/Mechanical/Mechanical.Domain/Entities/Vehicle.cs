using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Acontplus.Core.Domain.Common.Entities;

namespace Mechanical.Domain.Entities;

[Table("Vehicle", Schema = "Mechanical")]
public class Vehicle : BaseEntity
{
  public required VehicleType VehicleType { get; set; }
  public int VehicleTypeId { get; set; }

  public int CountryId { get; set; }

  [MaxLength(10)] public required string LicensePlate { get; set; }

  [MaxLength(100)] public required string Brand { get; set; }


  [MaxLength(100)] public string? Model { get; set; }

  public int Year { get; set; }

  [MaxLength(100)] public required string Color { get; set; }

  [MaxLength(100)] public required string Engine { get; set; }

  [MaxLength(150)] public required string Chassis { get; set; }

  [MaxLength(150)] public string? Cylindraje { get; set; }
}
