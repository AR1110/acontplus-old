namespace Identity.Api.Entities;

/// <summary>
///     Tracks policy configuration changes for audit purposes
/// </summary>
[Table("PolicyConfigurationAudit", Schema = "Audit")]
public class PolicyConfigurationAudit : BaseEntity
{
    public int PolicyTypeId { get; set; }
    public required PolicyType PolicyType { get; set; }
    public int? LicenseTypeId { get; set; }
    public LicenseType? LicenseType { get; set; }
    public int? CompanyId { get; set; }

    [MaxLength(50)] public string ChangeType { get; set; } = string.Empty; // CREATE, UPDATE, DELETE

    [MaxLength(500)] public string? OldValue { get; set; }

    [MaxLength(500)] public string? NewValue { get; set; }

    [MaxLength(500)] public string? ChangeReason { get; set; }
}