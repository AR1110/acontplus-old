namespace Identity.Application.Dtos;

public record LicenseAccessDetailCreate(
    int LicenciaAccesoId,
    int Order,
    string Actions,
    int SubmenuId,
    int? CreatedByUserId = null
);

public record LicenseAccessDetailUpdate(
    int LicenciaAccesoId,
    int Order,
    string Actions,
    int SubmenuId,
    int? UpdatedByUserId = null
);

public class LicenseAccessDetailDto
{
    public int Id { get; set; }
    public int LicenciaAccesoId { get; set; }
    public int Order { get; set; }
    public required string Actions { get; set; }
    public int SubmenuId { get; set; }
    public int UpdatedByUserId { get; set; }
}
