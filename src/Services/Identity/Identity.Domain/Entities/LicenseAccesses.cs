namespace Identity.Domain.Entities;

[Table("LicenseAccesses", Schema = "Access")]
public class LicenseAccesses : BaseEntity
{
    /// <summary>
    /// FK to Configuration.Licenses - navigation removed for cross-service boundary
    /// </summary>
    public int LicenseId { get; set; }

    /// <summary>
    /// FK to Identity.AppRole - navigation removed for cross-service boundary
    /// </summary>
    public int RoleId { get; set; }

    public ICollection<LicenseAccessDetails> LicenseAccessDetails { get; set; } = [];
}
