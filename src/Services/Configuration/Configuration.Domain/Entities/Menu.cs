namespace Configuration.Domain.Entities;

[Table("Menu", Schema = "Config")]
public class Menu : BaseEntity
{
    public required Aplicacion Aplicacion { get; set; }
    public int AplicacionId { get; set; }

    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(150)] public string? Icon { get; set; }

    [MaxLength(60)] public required string Name { get; set; }

    public int Order { get; set; }

    [MaxLength(150)] public required string Url { get; set; }

    public int? ParentId { get; set; }

    [ForeignKey("ParentId")] public Menu? Parent { get; set; }

    public ICollection<Menu> Children { get; set; } = [];

    public ICollection<MenuAction> MenuActions { get; set; } = [];

    public ICollection<UserManual> UserManuals { get; set; } = [];
}