namespace Vet.Domain.Entities;

[Table("BehaviorStatus", Schema = "Vet")]
public class BehaviorStatus : BaseEntity
{
    [MaxLength(2)] public required string Code { get; set; }

    [MaxLength(50)] public required string Name { get; set; }

    [MaxLength(100)] public string? Description { get; set; }

    public int? Order { get; set; }
}
