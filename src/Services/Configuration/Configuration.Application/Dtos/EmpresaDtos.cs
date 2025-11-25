namespace Configuration.Application.Dtos;

public record CreateEmpresaDto
{
    public string IdType { get; init; }
    public string IdCard { get; init; }
    public string BusinessName { get; init; }
    public string TradeName { get; init; }
    public string Email { get; init; }
    public string Telephone { get; init; }
    public string Address { get; init; }
    public bool SriValidation { get; init; }
}

public record UpdateEmpresaDto
{
    public string BusinessName { get; init; }
    public string TradeName { get; init; }
    public string Email { get; init; }
    public string Telephone { get; init; }
    public string Address { get; init; }
    public bool Estado { get; init; }
}
