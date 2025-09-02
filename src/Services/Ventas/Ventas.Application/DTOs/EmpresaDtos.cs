namespace Ventas.Application.DTOs;

public record CreateEmpresaDto
{
    public string IdType { get; init; } = string.Empty;
    public string IdCard { get; init; } = string.Empty;
    public string BusinessName { get; init; } = string.Empty;
    public string TradeName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Telephone { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public bool SriValidation { get; init; }
}

public record UpdateEmpresaDto
{
    public string BusinessName { get; init; } = string.Empty;
    public string TradeName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Telephone { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public bool Estado { get; init; }
}
