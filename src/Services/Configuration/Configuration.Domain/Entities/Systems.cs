namespace Configuration.Domain.Entities;

[Table("Systems", Schema = "Config")]
public class Systems : BaseEntity
{
    [MaxLength(10)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }

    [MaxLength(300)] public string? DomainUrl { get; set; }

    [MaxLength(300)] public required string IpAddress { get; set; }

    [MaxLength(1000)] public string? ConnectionStrings { get; set; }

    public ICollection<Applications> Applications { get; set; } = [];
}
