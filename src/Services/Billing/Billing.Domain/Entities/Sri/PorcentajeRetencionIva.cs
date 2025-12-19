namespace Billing.Domain.Entities.Sri;

[Table("PorcentajeRetencionIva", Schema = "Sri")]
public class PorcentajeRetencionIva : BaseEntity
{
    [MaxLength(5)] public required string Codigo { get; set; }

    [MaxLength(50)] public required string Descripcion { get; set; }

    [Column(TypeName = "decimal(6,2)")]
    public decimal Porcentaje { get; set; }

    public DateOnly? FechaInicio { get; set; }

    public DateOnly? FechaFin { get; set; }
}
