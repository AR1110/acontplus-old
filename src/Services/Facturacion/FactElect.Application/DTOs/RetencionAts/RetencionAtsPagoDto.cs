namespace FactElect.Application.DTOs.RetencionAts;

public class RetencionAtsPagoDto
{
    public int IdRetencionAtsPago { get; set; }
    public int IdRetencionAts { get; set; }
    public Guid UniqueIdDoc { get; set; }
    public decimal Total { get; set; }
    public int FormaPagoId { get; set; }
}