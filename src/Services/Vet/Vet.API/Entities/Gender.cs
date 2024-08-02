namespace Vet.API.Entities;

[Table("Gender", Schema = "Vet")]
public class Gender : BaseEntity
{
    [Required] [MaxLength(2)] public string Code { get; set; }

    [Required] [MaxLength(100)] public string Name { get; set; }

    [MaxLength(300)] public string Description { get; set; }
}
