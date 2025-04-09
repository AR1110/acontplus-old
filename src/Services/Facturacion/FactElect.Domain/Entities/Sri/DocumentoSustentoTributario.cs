namespace FactElect.Domain.Entities.Sri;

[Table("DocumentoSustentoTributario", Schema = "Sri")]
public class DocumentoSustentoTributario : BaseEntity
{
    public TipoComprobante TipoComprobante { get; set; }
    public int TipoComprobanteId { get; set; }
    public SustentoTributario SustentoTributario { get; set; }
    public int SustentoTributarioId { get; set; }
}