namespace Accounting.Application.DTOs;

public record CreateControlCajaDto
{
    public int IdCaja { get; init; }
    public int IdEntidadFinanciera { get; init; }
    public string Concepto { get; init; }
    public decimal Entrada { get; init; }
}

public record UpdateControlCajaDto
{
    public decimal TotalArqueo { get; init; }
    public string ArqueoCaja { get; init; }
}

public record ControlCajaDtos
{
    public CreateControlCajaDto Create { get; init; } = new();
    public UpdateControlCajaDto Update { get; init; } = new();
}
