using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("Serie", Schema = "TechnicalSupport")]
public class Serie : BaseEntity
{
  public required Brand Brand { get; set; }
  public int BrandId { get; set; }

  [MaxLength(25)] public required string Code { get; set; }

  [MaxLength(150)] public required string Name { get; set; }

  public int? Year { get; set; }
}
