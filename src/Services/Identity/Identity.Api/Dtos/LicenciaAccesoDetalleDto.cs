namespace Identity.Api.Dtos;

public record LicenciaAccesoDetalleCreate(
    int LicenciaAccesoId,
    int Order,
    string Actions,
    int SubmenuId,
    int? CreatedByUserId = null
);

public record LicenciaAccesoDetalleUpdate(
    int LicenciaAccesoId,
    int Order,
    string Actions,
    int SubmenuId,
    int? UpdatedByUserId = null
);

public class LicenciaAccesoDetalleDto
{
    public int Id { get; set; }
    public int LicenciaAccesoId { get; set; }
    public int Order { get; set; }
    public required string Actions { get; set; }
    public int SubmenuId { get; set; }
    public int UpdatedByUserId { get; set; }
}