namespace FactElect.Domain.Entities.Sri;

[Table("TipoPago", Schema = "Sri")]
public class TipoPago : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(100)] public string Descripcion { get; set; }

    public ICollection<ConceptoRetencionAir> ConceptoRetenciones { get; set; }
}
