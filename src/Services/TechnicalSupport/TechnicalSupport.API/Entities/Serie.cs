using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.API.Entities;

[Table("Serie", Schema = "TechnicalSupport")]
public class Serie : BaseEntity
{
    public Brand Brand { get; set; }
    public int BrandId { get; set; }

    [Required] [MaxLength(25)] public string Code { get; set; }

    [Required] [MaxLength(150)] public string Name { get; set; }

    public int? Year { get; set; }
}