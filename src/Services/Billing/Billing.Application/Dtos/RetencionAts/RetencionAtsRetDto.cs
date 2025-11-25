namespace Billing.Application.Dtos.RetencionAts;

public class RetencionAtsRetDto
{
    public int IdRetencionAtsRet { get; set; }
    public int IdRetAtsDocSustento { get; set; }
    public int IdRetencionAts { get; set; }
    public Guid UniqueIdDoc { get; set; }
    public int ImpuestoRetencionId { get; set; }
    [Required] public string CodigoRetencion { get; set; }
    public decimal BaseImponible { get; set; }
    public decimal PorcentajeRetener { get; set; }
    public decimal ValorRetenido { get; set; }
}
