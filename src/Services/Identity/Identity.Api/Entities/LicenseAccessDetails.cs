namespace Identity.Api.Entities;

[Table("LicenseAccessDetails", Schema = "Access")]
public class LicenseAccessDetails : BaseEntity
{
    public required LicenseAccesses LicenseAccess { get; set; }
    public int LicenciaAccesoId { get; set; }
    public int? Order { get; set; }

    /// <summary>
    /// FK to Configuration.Menu - navigation removed for cross-service boundary
    /// </summary>
    public int? MenuId { get; set; }

    public string? Actions { get; set; }
}
