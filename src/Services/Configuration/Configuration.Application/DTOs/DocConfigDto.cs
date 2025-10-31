namespace Configuration.Application.DTOs;

public record CreateDocConfigDto
{
    public DocItem[]? Docs { get; set; }
    public int? DemoStepId { get; set; }
}

public record DocItem
{
    public int? Id { get; set; }
    public int IdPuntoEmision { get; set; }
    public int IdTipoDocumento { get; set; }
    public int UltimaSecuencia { get; set; }
    public string? InfoAdicional { get; set; }
    public bool? EditInfo { get; set; }
    public bool Estado { get; set; } = true;
}