namespace Vet.Domain.Entities;

[Table("MedicalHistory", Schema = "Vet")]
public class MedicalHistory : BaseEntity
{
    public required DateTime Date { get; set; }
    public required Pet Pet { get; set; }
    public int PetId { get; set; }
    [MaxLength(300)] public string? Observations { get; set; }
    public ICollection<HealthCheck> HealthChecks { get; set; } = [];
    public ICollection<BehaviorTest> BehaviorTests { get; set; } = [];
    public int? EstablecimientoId { get; set; }

    [Column(TypeName = "decimal(4,2)")]
    public decimal? Age { get; set; }

    [Column(TypeName = "decimal(4,2)")]
    public decimal? Weight { get; set; }
}
