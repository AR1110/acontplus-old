using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("Brand", Schema = "TechnicalSupport")]
public class Brand : BaseEntity
{
  public required Category Category { get; set; }
  public int CategoryId { get; set; }

  [MaxLength(25)] public required string Code { get; set; }

  [MaxLength(150)] public required string Name { get; set; }

  public ICollection<Serie> Series { get; set; } = [];
}
