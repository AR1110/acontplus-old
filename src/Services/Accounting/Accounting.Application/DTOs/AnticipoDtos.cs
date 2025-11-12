namespace Accounting.Application.DTOs;

public record CreateAnticipoDto
{
    public int IdCliente { get; init; }
    public string CodEstab { get; init; }
    public int IdSubEntidadFinanciera { get; init; }
    public decimal Valor { get; init; }
    public string? Observaciones { get; init; }
}

public record UpdateAnticipoDto
{
    public int IdAnticipo { get; init; }
    public int IdCliente { get; init; }
    public string CodEstab { get; init; }
    public int IdSubEntidadFinanciera { get; init; }
    public decimal Valor { get; init; }
    public string? Observaciones { get; init; }
}
