namespace FactElect.Domain.Entities.Sri;

[Table("ParaisoFiscal", Schema = "Sri")]
public class ParaisoFiscal : BaseEntity
{
    [Required, MaxLength(5)] public required string Codigo { get; init; }

    [Required, MaxLength(150)] public required string Descripcion { get; init; }

    public DateOnly? FechaInicio { get; init; }

    public DateOnly? FechaFin { get; init; }

    public required Pais Pais { get; init; }

    public int PaisId { get; init; }
}