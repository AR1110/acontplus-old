using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Domain.Entities;

[Table("MaritalStatus", Schema = "Common")]
public class MaritalStatus : BaseEntity
{
    [Required][MaxLength(5)] public string Code { get; set; }

    [Required][MaxLength(50)] public string Name { get; set; }
}