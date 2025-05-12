namespace FactElect.Domain.Entities.Sri;

[Table("TipoComprobante", Schema = "Sri")]
public class TipoComprobante : BaseEntity
{
    [Required, MaxLength(5)] public required string Codigo { get; init; }

    [Required, MaxLength(300)] public required string Descripcion { get; init; }

    public DateOnly FechaVigencia { get; init; }

    public required ICollection<DocumentoSustentoTributario> DocumentosSustentoTributario { get; init; }
}