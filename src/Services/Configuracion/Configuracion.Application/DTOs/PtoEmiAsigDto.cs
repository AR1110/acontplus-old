namespace Configuracion.Application.DTOs;

public record CreatePtoEmiAsigDto
{
  public string CodEstab { get; set; } = string.Empty;

  [MaxLength(5)]
  public string? Ambiente { get; set; }

  [MaxLength(5)]
  public string? PtoEmi { get; set; }
}

public record UpdatePtoEmiAsigDto
{
  public string Ambiente { get; set; } = string.Empty;
  public string PtoEmi { get; set; } = string.Empty;
  public bool Estado { get; set; }
}