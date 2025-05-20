namespace Contabilidad.API.Entities;

[Table("Subcategory", Schema = "Contabilidad")]
public class Subcategory : BaseEntity
{
    public Category Category { get; set; }
    public int CategoryId { get; set; }
    public int CompanyId { get; set; }

    [Required] [MaxLength(10)] public string Code { get; set; }

    [Required] [MaxLength(300)] public string Name { get; set; }
}