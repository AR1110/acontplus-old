using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Acontplus.Core.Domain.Common.Entities;

namespace Mechanical.Domain.Entities;

[Table("SupportStatus", Schema = "Mechanical")]
public class SupportStatus : BaseEntity
{
  [MaxLength(5)] public required string Code { get; set; }

  [MaxLength(100)] public required string Name { get; set; }

  public int Order { get; set; }
}
