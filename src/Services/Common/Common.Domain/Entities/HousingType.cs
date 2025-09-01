using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Domain.Entities;

[Table("HousingType", Schema = "Common")]
public class HousingType : BaseEntity
{
    [Required][MaxLength(5)] public string Code { get; set; }

    [Required][MaxLength(100)] public string Name { get; set; }

    [MaxLength(300)] public string Description { get; set; }
}