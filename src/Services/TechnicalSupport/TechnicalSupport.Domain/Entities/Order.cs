using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("Order", Schema = "TechnicalSupport")]
public class Order : BaseEntity
{
    public int? AssignedUserId { get; set; }
    public Guid Uuid { get; set; }
    public int EstablecimientoId { get; set; }
    public DateTime FechaEmision { get; set; }
    public bool? Finished { get; set; }
    public int PuntoEmisionId { get; set; }
    public int Sequence { get; set; }

    [MaxLength(18)] public required string Serie { get; set; }

    public int CustomerCompanyId { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Tax { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Tip { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Total { get; set; }

    [MaxLength(500)] public string? Obs { get; set; }

    public required OrderStatus OrderStatus { get; set; }
    public int OrderStatusId { get; set; }
    public int? TaxPercentId { get; set; }

    [MaxLength(300)] public string? Receiver { get; set; }

    [MaxLength(25)] public string? ReceiverGovernmentId { get; set; }

    public ICollection<OrderDetail> OrderDetails { get; set; } = [];
}
