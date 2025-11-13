using Acontplus.Core.Domain.Common.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Domain.Entities;

[Table("SupportDetail", Schema = "Mechanical")]
public class SupportDetail : BaseEntity
{
    public Support support { get; set; }
    public int SupportId { get; set; }
    public int ArticuloId { get; set; }
    public int TarifaId { get; set; }
    public int BodegaId { get; set; }
    public int MedidaId { get; set; }
    public int TaxId { get; set; }
    public int TaxPercentId { get; set; }

    [Required][MaxLength(300)] public string Description { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,5)")]
    public decimal Quantity { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,5)")]
    public decimal Cost { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,5)")]
    public decimal TaxValue { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,5)")]
    public decimal Price { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,5)")]
    public decimal Discount { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,5)")]
    public decimal Total { get; set; }

    [MaxLength(300)] public string Obs { get; set; }
}
