using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Domain.Entities;

[Table("MaritalStatus", Schema = "Common")]
public class MaritalStatus : BaseEntity
{
    [Required][MaxLength(5)] public required string Code { get; set; }

    [Required][MaxLength(50)] public required string Name { get; set; }
}
