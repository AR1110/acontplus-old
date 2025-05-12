namespace FactElect.Domain.Entities.Sri;

[Table("PorcentajeRetencionIva", Schema = "Sri")]
public class PorcentajeRetencionIva : BaseEntity
{
    [Required, MaxLength(5)] public required string Codigo { get; init; }

    [Required, MaxLength(50)] public required string Descripcion { get; init; }

    [Column(TypeName = "numeric(6,2), null")]
    public decimal Porcentaje { get; init; }

    public DateOnly? FechaInicio { get; init; }

    public DateOnly? FechaFin { get; init; }
}
