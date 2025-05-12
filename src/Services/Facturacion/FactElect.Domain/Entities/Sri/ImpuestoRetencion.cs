namespace FactElect.Domain.Entities.Sri;

[Table("ImpuestoRetencion", Schema = "Sri")]
public class ImpuestoRetencion : BaseEntity
{
    [Required, MaxLength(1)] public required string Codigo { get; init; }

    [Required, MaxLength(50)] public required string Descripcion { get; init; }
}