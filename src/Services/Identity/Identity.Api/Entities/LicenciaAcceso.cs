namespace Identity.Api.Entities;

[Table("LicenciaAcceso", Schema = "Seguridad")]
public class LicenciaAcceso : BaseEntity
{
    /// <summary>
    /// FK to Config.Licencia - navigation removed for cross-service boundary
    /// </summary>
    public int LicenciaId { get; set; }

    /// <summary>
    /// FK to Identity.AppRole - navigation removed for cross-service boundary
    /// </summary>
    public int RoleId { get; set; }

    public ICollection<LicenciaAccesoDetalle> LicenciaAccesoDetalles { get; set; } = [];
}
