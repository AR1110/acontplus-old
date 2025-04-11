namespace FactElect.Application.DTOs.RetencionAts;

public class RetAtsDocSustentoDto
{
    public int IdRetAtsDocSustento { get; set; }
    public Guid UniqueIdDoc { get; set; }
    public string NumDocSustento { get; set; }
    public DateTime FechaEmisionDocSustento { get; set; }
    public DateTime? FechaRegistroContable { get; set; }
    public string NumAutDocSustento { get; set; }
    public string PagoLocExt { get; set; }
    public string PaisEfecPago { get; set; }
    public string AplicConvDobTrib { get; set; }
    public string PagExtSuhRetNorLeg { get; set; }
    public string PagoRegFis { get; set; }
    public decimal TotalComprobantesReembolso { get; set; }
    public decimal TotalBaseImponibleReembolso { get; set; }
    public decimal TotalImpuestoReembolso { get; set; }
    public decimal TotalSinImpuestos { get; set; }
    public decimal ImporteTotal { get; set; }
    public int DocumentoSustentoTributarioId { get; set; }
    public int TipoRegimenFiscalExterior { get; set; }

    public List<RetAtsImpDocSustentoDto> Taxes { get; set; } = new();
    public List<RetencionAtsRetDto> Retenciones { get; set; } = new();
    public List<RetencionAtsPagoDto> Payments { get; set; } = new();
}