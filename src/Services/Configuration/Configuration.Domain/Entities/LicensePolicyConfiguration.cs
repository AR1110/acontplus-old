namespace Configuration.Domain.Entities;

/// <summary>
///     Defines policy configurations specific to license types
/// </summary>
[Table("LicensePolicyConfiguration", Schema = "Config")]
public class LicensePolicyConfiguration : BaseEntity
{
    public int LicenseTypeId { get; set; }
    public required LicenseType LicenseType { get; set; }

    /// <summary>
    /// FK to Identity.PolicyType - navigation removed for cross-service boundary
    /// </summary>
    public int PolicyTypeId { get; set; }

    [MaxLength(500)] public string PolicyValue { get; set; } = string.Empty;
}
