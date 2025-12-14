using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Acontplus.Core.Domain.Common.Entities;

namespace Mechanical.Domain.Entities;

[Table("Inspection", Schema = "Mechanical")]
public class Inspection : BaseEntity
{
  public required Support Support { get; set; }
  public int SupportId { get; set; }
  public DateTime Date { get; set; }
  public int Mileage { get; set; }

  [MaxLength(150)] public required string FuelLevel { get; set; }

  public required string Engine { get; set; }

  public required string Cabin { get; set; }

  public required string Bearing { get; set; }

  public required string Transmission { get; set; }

  public required string Lighting { get; set; }

  public required string Brake { get; set; }

  public required string Steering { get; set; }

  public required string Suspension { get; set; }

  [MaxLength(300)] public string? Obs { get; set; }

  public int CompanyId { get; set; }
  public int Status { get; set; } = 0;
}
