namespace FactElect.Domain.Entities.Sri;

[Table("DocumentoSustentoTributario", Schema = "Sri")]
public class DocumentoSustentoTributario : BaseEntity
{
    public required TipoComprobante TipoComprobante { get; init; }
    public int TipoComprobanteId { get; init; }
    public required SustentoTributario SustentoTributario { get; init; }
    public int SustentoTributarioId { get; init; }
}