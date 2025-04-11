namespace FactElect.Application.DTOs.RetencionAts;

public class RetAtsImpDocSustentoDto
{
    public int IdRetAtsImpDocSustento { get; set; }
    public int IdRetAtsDocSustento { get; set; }
    public Guid UniqueIdDoc { get; set; }
    public decimal BaseImponible { get; set; }
    public decimal ValorImpuesto { get; set; }
    public int IdTarifaImpuesto { get; set; }
}