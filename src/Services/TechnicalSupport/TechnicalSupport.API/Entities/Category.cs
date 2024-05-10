using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.API.Entities;

[Table("Category", Schema = "TechnicalSupport")]
public class Category : BaseEntity
{
    public int CompanyId { get; set; }

    [Required] [MaxLength(25)] public string Code { get; set; }

    [Required] [MaxLength(300)] public string Name { get; set; }
}
