namespace FactElect.Domain.Entities.Sri;

[Table("TipoComprobante", Schema = "Sri")]
public class TipoComprobante : BaseEntity
{
    [Required] [MaxLength(5)] public required string Codigo { get; set; }

    [Required] [MaxLength(300)] public required string Descripcion { get; set; }

    public DateOnly FechaVigencia { get; set; }

    public required ICollection<DocumentoSustentoTributario> DocumentosSustentoTributario { get; set; }
}