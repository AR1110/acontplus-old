namespace Billing.Domain.Entities.Sri;

[Table("DocumentoSustentoTributario", Schema = "Sri")]
public class DocumentoSustentoTributario : BaseEntity
{
    public required TipoComprobante TipoComprobante { get; set; }
    public int TipoComprobanteId { get; set; }
    public required SustentoTributario SustentoTributario { get; set; }
    public int SustentoTributarioId { get; set; }
}