namespace Configuration.Domain.Entities;

[Table("Days", Schema = "Config")]
public class Days : Entity<int>
{
    [MaxLength(50)] public required string Name { get; set; }

    public int NumberDay { get; set; }
}
