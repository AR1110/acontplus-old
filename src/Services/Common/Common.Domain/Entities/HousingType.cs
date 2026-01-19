namespace Common.Domain.Entities;

[Table("HousingType", Schema = "Common")]
public class HousingType : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(300)] public string? Description { get; set; }
}
