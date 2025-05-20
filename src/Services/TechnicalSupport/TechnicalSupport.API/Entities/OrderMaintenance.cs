using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.API.Entities;

[Table("OrderMaintenance", Schema = "TechnicalSupport")]
public class OrderMaintenance : BaseEntity
{
    public int BodegaId { get; set; }
    public int FeeId { get; set; }
    public int MedidaId { get; set; }

    [Required] [MaxLength(300)] public string Descripcion { get; set; }

    public OrderDetail OrderDetail { get; set; }
    public int OrderDetailId { get; set; }
    public int ProductId { get; set; }
    public int TaxId { get; set; }
    public int TaxPercentId { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal Quantity { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal Cost { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal TaxValue { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal Price { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal Discount { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal Total { get; set; }

    [MaxLength(300)] public string Obs { get; set; }
}