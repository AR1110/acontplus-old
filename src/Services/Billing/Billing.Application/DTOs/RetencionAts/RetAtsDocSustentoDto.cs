namespace Billing.Application.DTOs.RetencionAts;

public class RetAtsDocSustentoDto
{
    public int IdRetencionAts { get; set; }
    public int IdRetAtsDocSustento { get; set; }
    public Guid UniqueIdDoc { get; set; }
    public int DocumentoSustentoTributarioId { get; set; }
    public string NumDocSustento { get; set; }
    public DateTime FechaEmisionDocSustento { get; set; }
    public DateTime? FechaRegistroContable { get; set; }
    public string NumAutDocSustento { get; set; }
    public string PagoLocExt { get; set; }
    public int TipoRegimenFiscalExteriorId { get; set; }
    public string PaisEfecPago { get; set; }
    public string AplicConvDobTrib { get; set; }
    public string PagExtSujRetNorLeg { get; set; }
    public string PagoRegFis { get; set; }
    public decimal TotalComprobantesReembolso { get; set; }
    public decimal TotalBaseImponibleReembolso { get; set; }
    public decimal TotalImpuestoReembolso { get; set; }
    public decimal TotalSinImpuestos { get; set; }
    public decimal ImporteTotal { get; set; }
    public List<RetAtsImpDocSustentoDto> Taxes { get; set; } = [];
    public List<RetencionAtsRetDto> Retenciones { get; set; } = [];
    public List<RetencionAtsPagoDto> Payments { get; set; } = [];
}
