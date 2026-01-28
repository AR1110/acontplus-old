namespace Common.Domain.Entities;

[Table("Tag", Schema = "Common")]
public class Tag : BaseEntity
{
    [MaxLength(100)] public required string Name { get; set; }

    // Navigation property to UserManualTag junction table
    public ICollection<UserManualTag> UserManualTags { get; set; } = [];
}