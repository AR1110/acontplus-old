namespace Configuration.Domain.Entities;

[Table("Sistema", Schema = "Config")]
public class Sistema : BaseEntity
{
    [MaxLength(10)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }

    [MaxLength(300)] public string? DomainUrl { get; set; }

    [MaxLength(300)] public required string IpAddress { get; set; }

    [MaxLength(1000)] public string? ConnectionStrings { get; set; }

    public ICollection<Aplicacion> Aplicaciones { get; set; } = [];
}