namespace Vet.Domain.Entities;

[Table("Pet", Schema = "Vet")]
public class Pet : BaseEntity
{
  public int CustomerCompanyId { get; set; }
  [MaxLength(150)] public required string Name { get; set; }
  public Breed? Breed { get; set; }
  public int? BreedId { get; set; }
  public Gender? Gender { get; set; }
  public int? GenderId { get; set; }
  [MaxLength(50)] public required string Color { get; set; }
  public DateTime? Birthdate { get; set; }
}
