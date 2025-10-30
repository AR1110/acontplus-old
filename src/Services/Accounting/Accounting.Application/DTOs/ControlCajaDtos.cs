namespace Accounting.Application.DTOs;

public record CreateControlCajaDto
{
    public int IdCaja { get; init; }
    public int IdEntidadFinanciera { get; init; }
    public string Concepto { get; init; } = string.Empty;
    public decimal Entrada { get; init; }
}

public record UpdateControlCajaDto
{
    public decimal TotalArqueo { get; init; }
    public string ArqueoCaja { get; init; } = string.Empty;
}

public record ControlCajaDtos
{
    public CreateControlCajaDto Create { get; init; } = new();
    public UpdateControlCajaDto Update { get; init; } = new();
}
