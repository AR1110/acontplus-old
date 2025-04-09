namespace FactElect.Application.DTOs.RetencionAts;

public class RetencionAtsDto
{
    public int IdRetencionAts { get; set; }
    public int IdPuntoEmision { get; set; }
    public string ParteRel { get; set; }
    public int IdProveedor { get; set; }
    public string TipoSujetoRetenido { get; set; }
    public DateTime FechaEmision { get; set; }
    public List<DocumentoSustentoDto> Documentos { get; set; }
    public InfoAdicionalDto InfoAdicional { get; set; }
}
