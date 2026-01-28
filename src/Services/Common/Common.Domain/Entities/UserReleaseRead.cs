namespace Common.Domain.Entities;

[Table("UserReleaseRead", Schema = "Common")]
public class UserReleaseRead : BaseEntity
{
    public required Release Release { get; set; }
    public int ReleaseId { get; set; }
}