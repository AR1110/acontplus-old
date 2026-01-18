namespace Common.Domain.Entities;

[Table("Days", Schema = "Common")]
public class Days : Entity<int>
{
    [MaxLength(50)] public required string Name { get; set; }

    public int NumberDay { get; set; }
}
