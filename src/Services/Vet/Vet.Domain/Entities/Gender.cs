namespace Vet.Domain.Entities;

[Table("Gender", Schema = "Vet")]
public class Gender : BaseEntity
{
    [Required][MaxLength(2)] public required string Code { get; set; }

    [Required][MaxLength(100)] public required string Name { get; set; }

    [MaxLength(300)] public string? Description { get; set; }
}
