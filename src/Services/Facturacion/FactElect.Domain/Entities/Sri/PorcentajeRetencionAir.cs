namespace FactElect.Domain.Entities.Sri;

[Table("PorcentajeRetencionAir", Schema = "Sri")]
public class PorcentajeRetencionAir : BaseEntity
{
    public DateOnly? FechaInicio { get; init; }
    public required ConceptoRetencionAir ConceptoRetencionAir { get; init; }
    public int ConceptoRetencionAirId { get; init; }

    [Column(TypeName = "numeric(6,2), null")]
    public decimal Porcentaje { get; init; }

    public bool IsDefault { get; init; }
}