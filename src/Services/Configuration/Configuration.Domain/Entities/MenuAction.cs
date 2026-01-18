namespace Configuration.Domain.Entities;

[Table("MenuAction", Schema = "Config")]
public class MenuAction : BaseEntity
{
    public int MenuId { get; set; }
    public required Menu Menu { get; set; }

    public int ActionId { get; set; }
    public Actions? Action { get; set; }
}
