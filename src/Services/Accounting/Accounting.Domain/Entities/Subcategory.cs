namespace Accounting.Domain.Entities;

[Table("Subcategory", Schema = "Contabilidad")]
public class Subcategory : BaseEntity
{
    public required Category Category { get; set; }
    public int CategoryId { get; set; }
    public int CompanyId { get; set; }

    [MaxLength(10)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }
}
