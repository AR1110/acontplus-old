using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.API.Entities;

[Table("Brand", Schema = "TechnicalSupport")]
public class Brand : BaseEntity
{
    public Category Category { get; set; }
    public int CategoryId { get; set; }

    [Required][MaxLength(25)] public string Code { get; set; }

    [Required][MaxLength(150)] public string Name { get; set; }

    public List<Serie> Series { get; set; }
}
