using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Base;

namespace Mechanical.API.Entities;

[Table("Support", Schema = "Mechanical")]
public class Support : BaseEntity
{
    public int PuntoEmisionId { get; set; }

    [Required] public DateTime Date { get; set; }

    public int Sequence { get; set; }
    public VehicleCompany VehicleCompany { get; set; }
    public int VehicleCompanyId { get; set; }
    public SupportStatus SupportStatus { get; set; }
    public int SupportStatusId { get; set; }
    public int CustomerId { get; set; }
    public int CompanyId { get; set; }
    public int UserAssignedId { get; set; }

    [Required]
    [Column(TypeName = "numeric(18,5), null")]
    public decimal Discount { get; set; }

    [Required]
    [Column(TypeName = "numeric(18,5), null")]
    public decimal Total { get; set; }

    [MaxLength(500)] public string Obs { get; set; }
}