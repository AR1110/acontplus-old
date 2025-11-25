
namespace Configuration.Application.DTOs;

public record EstablishmentDto
{
    public int? Id { get; set; }
    public int? userRoleId { get; set; }
    public int? DemoStepId { get; set; }
    public string? PtosEmi { get; set; }
    public string? Bodegas { get; set; }
    public string? Canton { get; set; }
    public string? Actividad { get; set; }
    public string? AgenteRetencion { get; set; }
    public string? Contribuyente { get; set; }
    public string? Estab { get; set; }
    public string? CodEstab { get; set; }
    public string? ContribuyenteEspecial { get; set; }
    public string? ObligadoContabilidad { get; set; }
    public string? NombreComercial { get; set; }
    public string? DirEstablecimiento { get; set; }
    public string? Telefono { get; set; }
    public string? ContribuyenteRimpe { get; set; }
    public string? Correo { get; set; }

}
