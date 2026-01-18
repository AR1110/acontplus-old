namespace Identity.Api.Entities;

[Table("Actions", Schema = "Seguridad")]
public class Actions : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(255)] public string? Description { get; set; }
}