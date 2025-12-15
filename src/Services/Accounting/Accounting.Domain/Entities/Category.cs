namespace Accounting.Domain.Entities;

[Table("Category", Schema = "Contabilidad")]
public class Category : BaseEntity
{
  public required Tipo Tipo { get; set; }
  public int TipoId { get; set; }

  [MaxLength(10)] public required string Code { get; set; }

  [MaxLength(300)] public required string Name { get; set; }

  public ICollection<Subcategory> Subcategories { get; set; } = [];
}
