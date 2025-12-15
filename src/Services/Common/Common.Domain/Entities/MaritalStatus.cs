using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Domain.Entities;

[Table("MaritalStatus", Schema = "Common")]
public class MaritalStatus : BaseEntity
{
  [MaxLength(5)] public required string Code { get; set; }

  [MaxLength(50)] public required string Name { get; set; }
}
