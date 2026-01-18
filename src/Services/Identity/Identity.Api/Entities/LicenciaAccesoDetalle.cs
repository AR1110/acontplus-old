namespace Identity.Api.Entities;

[Table("LicenciaAccesoDetalle", Schema = "Seguridad")]
public class LicenciaAccesoDetalle : BaseEntity
{
    public required LicenciaAcceso LicenciaAcceso { get; set; }
    public int LicenciaAccesoId { get; set; }
    public int? Order { get; set; }
    public int? MenuId { get; set; }
    public Menu? Menu { get; set; }
    public string? Actions { get; set; }
}