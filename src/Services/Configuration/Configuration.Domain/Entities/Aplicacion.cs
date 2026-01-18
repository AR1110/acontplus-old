namespace Configuration.Domain.Entities;

[Table("Aplicacion", Schema = "Config")]
public class Aplicacion : BaseEntity
{
    [MaxLength(10)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }

    public required Sistema Sistema { get; set; }
    public int SistemaId { get; set; }

    [MaxLength(300)] public string? DomainUrl { get; set; }

    [MaxLength(300)] public string? IpAddress { get; set; }

    [MaxLength(1000)] public string? ConnectionStrings { get; set; }

    public ICollection<Menu> Menus { get; set; } = [];
}
