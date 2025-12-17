using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("Category", Schema = "TechnicalSupport")]
public class Category : BaseEntity
{
    public int CompanyId { get; set; }

    [MaxLength(25)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }
}
