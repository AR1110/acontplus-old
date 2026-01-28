namespace Common.Domain.Entities;

[Table("UserManualTag", Schema = "Common")]
public class UserManualTag : BaseEntity
{
    public int UserManualId { get; set; }
    public required UserManual UserManual { get; set; }

    public int TagId { get; set; }
    public required Tag Tag { get; set; }
}