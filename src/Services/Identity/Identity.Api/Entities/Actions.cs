namespace Identity.Api.Entities;

/// <summary>
///     Schema "Seguridad" is correct for Identity service (security domain).
/// </summary>
[Table("Actions", Schema = "Identity")]
public class Actions : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(255)] public string? Description { get; set; }
}
