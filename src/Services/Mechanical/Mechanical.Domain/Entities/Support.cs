using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Acontplus.Core.Domain.Common.Entities;

namespace Mechanical.Domain.Entities;

[Table("Support", Schema = "Mechanical")]
public class Support : BaseEntity
{
  public int PuntoEmisionId { get; set; }

  public required DateTime Date { get; set; }

  public int Sequence { get; set; }
  public required VehicleCompany VehicleCompany { get; set; }
  public int VehicleCompanyId { get; set; }
  public required SupportStatus SupportStatus { get; set; }
  public int SupportStatusId { get; set; }
  public int CustomerId { get; set; }
  public int CompanyId { get; set; }
  public int UserAssignedId { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal Discount { get; set; }

  [Column(TypeName = "decimal(18,5)")]
  public required decimal Total { get; set; }

  [MaxLength(500)] public string? Obs { get; set; }
}
