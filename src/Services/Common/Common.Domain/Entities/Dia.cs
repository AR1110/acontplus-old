namespace Common.Domain.Entities;

[Table("Dia", Schema = "Common")]
public class Dia : Entity<int>
{
    [MaxLength(50)] public required string Name { get; set; }

    public int NumberDay { get; set; }
}