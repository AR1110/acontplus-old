namespace Vet.Domain.Entities;

[Table("MedicalHistory", Schema = "Vet")]
public class MedicalHistory : BaseEntity
{
    [Required] public DateTime Date { get; set; }
    public required Pet Pet { get; set; }
    public int PetId { get; set; }
    [MaxLength(300)] public string? Observations { get; set; }
    public ICollection<HealthCheck> HealthChecks { get; set; } = new List<HealthCheck>();
    public ICollection<BehaviorTest> BehaviorTests { get; set; } = new List<BehaviorTest>();
    public int? EstablecimientoId { get; set; }

    [Column(TypeName = "numeric(4,2), null")]
    public decimal? Age { get; set; }

    [Column(TypeName = "numeric(4,2), null")]
    public decimal? Weight { get; set; }
}
