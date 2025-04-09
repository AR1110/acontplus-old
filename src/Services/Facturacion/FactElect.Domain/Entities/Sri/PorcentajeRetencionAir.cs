namespace FactElect.Domain.Entities.Sri;

[Table("PorcentajeRetencionAir", Schema = "Sri")]
public class PorcentajeRetencionAir : BaseEntity
{
    public DateOnly? FechaInicio { get; set; }
    public ConceptoRetencionAir ConceptoRetencionAir { get; set; }
    public int ConceptoRetencionAirId { get; set; }

    [Column(TypeName = "numeric(6,2), null")]
    public Decimal Porcentaje { get; set; }

    public bool IsDefault { get; set; }
}