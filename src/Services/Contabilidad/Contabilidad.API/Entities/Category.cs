namespace Contabilidad.API.Entities;

[Table("Category", Schema = "Contabilidad")]
public class Category : BaseEntity
{
    public Tipo Tipo { get; set; }
    public int TipoId { get; set; }

    [Required][MaxLength(10)] public string Code { get; set; }

    [Required][MaxLength(300)] public string Name { get; set; }

    public List<Subcategory> Subcategories { get; set; }
}
