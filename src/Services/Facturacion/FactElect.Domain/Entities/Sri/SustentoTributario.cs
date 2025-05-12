namespace FactElect.Domain.Entities.Sri;

[Table("SustentoTributario", Schema = "Sri")]
public class SustentoTributario : BaseEntity
{
    [Required, MaxLength(5)] public required string Codigo { get; init; }

    [Required, MaxLength(300)] public required string Descripcion { get; init; }

    public DateOnly? FechaInicio { get; init; }

    public DateOnly? FechaFin { get; init; }

    public required ICollection<DocumentoSustentoTributario> DocumentosSustentoTributario { get; init; }
}