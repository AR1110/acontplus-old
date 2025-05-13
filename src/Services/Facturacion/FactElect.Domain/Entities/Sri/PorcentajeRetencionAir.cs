namespace FactElect.Domain.Entities.Sri;

[Table("PorcentajeRetencionAir", Schema = "Sri")]
public class PorcentajeRetencionAir : BaseEntity
{
    public DateOnly? FechaInicio { get; set; }
    public required ConceptoRetencionAir ConceptoRetencionAir { get; set; }
    public int ConceptoRetencionAirId { get; set; }

    [Column(TypeName = "numeric(6,2), null")]
    public decimal Porcentaje { get; set; }

    public bool IsDefault { get; set; }
}