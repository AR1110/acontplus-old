namespace Billing.Domain.Entities.Sri;

[Table("TipoPago", Schema = "Sri")]
public class TipoPago : BaseEntity
{
    [MaxLength(5)] public required string Codigo { get; set; }

    [MaxLength(100)] public required string Descripcion { get; set; }

    public required ICollection<ConceptoRetencionAir> ConceptoRetenciones { get; set; }
}
