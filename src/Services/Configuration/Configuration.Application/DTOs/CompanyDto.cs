namespace Configuration.Application.DTOs;

public record UpdateCompanyDto
{
    public string? Ruc { get; set; }
    public string? RazonSocial { get; set; }
    public string? NombreComercial { get; set; }
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
}