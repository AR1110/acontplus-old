namespace FactElect.Domain.Entities.Sri;

[Table("ConceptoRetencionAir", Schema = "Sri")]
public class ConceptoRetencionAir : BaseEntity
{
    public TipoPago TipoPago { get; set; }
    public int TipoPagoId { get; set; }

    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(100)] public string Descripcion { get; set; }

    [Column(TypeName = "numeric(6,2), null")]
    public decimal Porcentaje { get; set; }

    public ICollection<PorcentajeRetencionAir> PorcentajeRetencionAirs { get; set; } = new List<PorcentajeRetencionAir>();
}
