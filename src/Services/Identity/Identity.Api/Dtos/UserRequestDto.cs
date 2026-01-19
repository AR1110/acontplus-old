namespace Identity.Api.Dtos;

public record CreateUserRequestDto
{
    public string Motivo { get; set; }
    public string CodigoAccion { get; set; }
    public object JsonData { get; set; } = new();
    public string? SerieComprobante { get; set; }
    public string? TipoDoc { get; set; }
}

public record UpdateUserRequestDto
{
    public int Id { get; set; }
    public int Tipo { get; set; }
    public string Motivo { get; set; }
    public string CodigoAccion { get; set; }
    public object JsonData { get; set; } = new();
    public string? SerieComprobante { get; set; }
    public string? TipoDoc { get; set; }
}
