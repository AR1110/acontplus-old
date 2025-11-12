namespace Configuration.Application.DTOs;

public record CreateUserCustomerRequestDto
{
    public string Motivo { get; set; }
    public string CodigoAccion { get; set; }
    public object JsonData { get; set; } = new();
    public string? SerieComprobante { get; set; }
    public string? TipoDoc { get; set; }
}

public record UpdateUserCustomerRequestDto
{
    public int Id { get; set; }
    public int Tipo { get; set; }
    public string CodigoAccion { get; set; }
    public int? IdDocumento { get; set; }
    public string? CodDoc { get; set; }
    public string? Rowguid { get; set; }
}