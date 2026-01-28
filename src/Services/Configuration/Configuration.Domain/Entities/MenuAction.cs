namespace Configuration.Domain.Entities;

[Table("MenuAction", Schema = "Config")]
public class MenuAction : BaseEntity
{
    public int MenuId { get; set; }
    public required Menu Menu { get; set; }

    /// <summary>
    /// FK to Identity.Actions - navigation removed for cross-service boundary
    /// </summary>
    public int ActionId { get; set; }
}
