namespace Vet.API.Entities;

[Table("Pet", Schema = "Vet")]
public class Pet : BaseEntity
{
    public int CustomerCompanyId { get; set; }
    [Required][MaxLength(150)] public string Name { get; set; }
    public Breed Breed { get; set; }
    public int? BreedId { get; set; }
    public Gender Gender { get; set; }
    public int? GenderId { get; set; }
    [Required][MaxLength(50)] public string Color { get; set; }
    public DateTime? Birthdate { get; set; }
}