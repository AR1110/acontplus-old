using Common.Core.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contabilidad.Domain.Entities;

[Table("Category", Schema = "Contabilidad")]
public class Category : BaseEntity
{
    public required Tipo Tipo { get; set; }
    public int TipoId { get; set; }

    [Required][MaxLength(10)] public required string Code { get; set; }

    [Required][MaxLength(300)] public required string Name { get; set; }

    public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
}
