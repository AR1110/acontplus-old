namespace Configuration.Domain.Entities;

/// <summary>
///     Defines policy configurations specific to license types
/// </summary>
[Table("LicensePolicyConfiguration", Schema = "Config")]
public class LicensePolicyConfiguration : BaseEntity
{
    public int LicenseTypeId { get; set; }
    public required LicenseType LicenseType { get; set; }
    public int PolicyTypeId { get; set; }
    public required PolicyType PolicyType { get; set; }

    [MaxLength(500)] public string PolicyValue { get; set; } = string.Empty;
}