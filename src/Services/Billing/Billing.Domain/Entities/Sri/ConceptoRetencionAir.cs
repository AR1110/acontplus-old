namespace Billing.Domain.Entities.Sri;

[Table("ConceptoRetencionAir", Schema = "Sri")]
public class ConceptoRetencionAir : BaseEntity
{
    public required TipoPago TipoPago { get; set; }
    public int TipoPagoId { get; set; }

    [MaxLength(5)] public required string Codigo { get; set; }

    [MaxLength(300)] public required string Descripcion { get; set; }

    [Column(TypeName = "decimal(6,2)")]
    public decimal Porcentaje { get; set; }

    public ICollection<PorcentajeRetencionAir> PorcentajeRetencionAirs { get; set; } =
        [];
}
