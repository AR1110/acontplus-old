using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("OrderStatus", Schema = "TechnicalSupport")]
public class OrderStatus : BaseEntity
{
  [MaxLength(5)] public required string Code { get; set; }

  [MaxLength(100)] public required string Name { get; set; }

  public int Order { get; set; }
}
