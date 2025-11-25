namespace Configuration.Application.DTOs;

public record CreateSolicitudAutorizacionDto
{
    public string? CodigoModulo { get; set; }
    public int IdDocumentoRef { get; set; }
    public string? CodigoAccion { get; set; }
    public string? Obs { get; set; }
    public string? InfoExtraJson { get; set; }
    public int? IdUsuario { get; set; }
    public string? Detalles { get; set; }
};

public record UpdateSolicitudAutorizacionDto
{
    public int IdSolicitudAutorizacion { get; set; }
    public int Tipo { get; set; }
    public string? CodigoAccion { get; set; }
    public int IdDocumento { get; set; }
    public string? CodigoModulo { get; set; }
    public string? Rowguid { get; set; }
};
