namespace Configuracion.Application.DTOs;

public record CreatePtoEmisionDto
{
    public string CodEstab { get; set; } = string.Empty;
    public string Ambiente { get; set; } = string.Empty;
    public string PtoEmi { get; set; } = string.Empty;
}

public record UpdatePtoEmisionDto
{
    public string Ambiente { get; set; } = string.Empty;
    public string PtoEmi { get; set; } = string.Empty;
    public bool Estado { get; set; }
}