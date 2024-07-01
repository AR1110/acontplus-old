namespace Common.Core.Entities;

public class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool? Enabled { get; set; } = true;
    public bool? Deleted { get; set; }
    public int? UserId { get; set; }
    public bool? FromMobile { get; set; }
}
