using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("OrderDetail", Schema = "TechnicalSupport")]
public class OrderDetail : BaseEntity
{
    public int? AssignedUserId { get; set; }
    public Guid Uuid { get; set; }
    public required Order Order { get; set; }
    public int OrderId { get; set; }
    public required Device Device { get; set; }
    public int DeviceId { get; set; }

    [MaxLength(500)] public string? Obs { get; set; }

    public ICollection<OrderMaintenance> OrderMaintenances { get; set; } = [];
}
