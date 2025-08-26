using System.ComponentModel.DataAnnotations;

namespace Contabilidad.Domain.Entities;

[Table("Tipo", Schema = "Contabilidad")]
public class Tipo : BaseEntity
{
    [Required][MaxLength(10)] public string Code { get; set; }

    [Required][MaxLength(150)] public string Name { get; set; }
}
