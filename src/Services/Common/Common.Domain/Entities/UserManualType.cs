namespace Common.Domain.Entities;

[Table("UserManualType", Schema = "Common")]
public class UserManualType : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; } // e.g., Video, Document

    // Navigation property to UserManuals
    public ICollection<UserManual> UserManuals { get; set; } = [];
}