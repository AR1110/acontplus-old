namespace FactElect.Domain.Entities.Sri;

[Table("PorcentajeRetencionIva", Schema = "Sri")]
public class PorcentajeRetencionIva : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(300)] public string Descripcion { get; set; }

    [Column(TypeName = "numeric(6,2), null")]
    public Decimal Porcentaje { get; set; }

    public DateOnly? FechaInicio { get; set; }

    public DateOnly? FechaFin { get; set; }
}