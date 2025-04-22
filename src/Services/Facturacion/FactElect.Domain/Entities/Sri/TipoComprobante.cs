namespace FactElect.Domain.Entities.Sri;

[Table("TipoComprobante", Schema = "Sri")]
public class TipoComprobante : BaseEntity
{
    [Required, MaxLength(5)] public string Codigo { get; set; }

    [Required, MaxLength(300)] public string Descripcion { get; set; }

    public DateOnly FechaVigencia { get; set; }

    public ICollection<DocumentoSustentoTributario> DocumentosSustentoTributario { get; set; }
}