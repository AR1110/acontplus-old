namespace Configuration.Domain.Entities;

[Table("DemoStep", Schema = "Config")]
public class DemoStep : BaseEntity
{
    [MaxLength(10)] public required string Code { get; set; }
    [MaxLength(100)] public required string Name { get; set; }
    [MaxLength(300)] public string? Description { get; set; }
    public bool Mandatory { get; set; }
}