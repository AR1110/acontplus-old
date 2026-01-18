namespace Identity.Api.Entities;

[Table("Role", Schema = "Seguridad")]
public class Role : BaseEntity
{
    [MaxLength(50)]
    public required string Code { get; set; }

    [MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}
