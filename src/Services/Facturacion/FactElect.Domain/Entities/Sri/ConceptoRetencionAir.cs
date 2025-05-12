namespace FactElect.Domain.Entities.Sri;

[Table("ConceptoRetencionAir", Schema = "Sri")]
public class ConceptoRetencionAir : BaseEntity
{
    public required TipoPago TipoPago { get; init; }
    public int TipoPagoId { get; init; }

    [Required, MaxLength(5)] public required string Codigo { get; init; }

    [Required, MaxLength(300)] public required string Descripcion { get; init; }

    [Column(TypeName = "numeric(6,2), null")]
    public decimal Porcentaje { get; init; }

    public ICollection<PorcentajeRetencionAir> PorcentajeRetencionAirs { get; init; } = new List<PorcentajeRetencionAir>();
}
