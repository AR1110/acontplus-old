namespace Identity.Api.Entities;

[Table("LicenciaAccesoDetalle", Schema = "Seguridad")]
public class LicenciaAccesoDetalle : BaseEntity
{
    public required LicenciaAcceso LicenciaAcceso { get; set; }
    public int LicenciaAccesoId { get; set; }
    public int? Order { get; set; }

    /// <summary>
    /// FK to Config.Menu - navigation removed for cross-service boundary
    /// </summary>
    public int? MenuId { get; set; }

    public string? Actions { get; set; }
}
