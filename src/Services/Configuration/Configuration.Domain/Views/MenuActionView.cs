namespace Configuration.Domain.Views;

/// <summary>
/// Read-only view for MenuAction with Action details from Identity service.
/// Maps to database view: Configuration.vw_MenuAction
/// </summary>
[Table("vw_MenuAction", Schema = "Configuration")]
public class MenuActionView
{
    public int Id { get; set; }
    public int MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public int ActionId { get; set; }
    public string ActionCode { get; set; } = string.Empty;
    public string ActionName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
