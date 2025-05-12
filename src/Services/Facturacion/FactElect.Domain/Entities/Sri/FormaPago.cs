namespace FactElect.Domain.Entities.Sri;

[Table("FormaPago", Schema = "Sri")]
public class FormaPago : BaseEntity
{
    [Required, MaxLength(5)] public required string Codigo { get; init; }
    [Required, MaxLength(200)] public required string Descripcion { get; init; }
    public DateOnly? FechaInicio { get; init; }
    public DateOnly? FechaFin { get; init; }
}
