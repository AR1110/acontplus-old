namespace Identity.Api.Entities;

/// <summary>
///     Tracks policy configuration changes for audit purposes
/// </summary>
[Table("PolicyConfigurationAudit", Schema = "Compliance")]
public class PolicyConfigurationAudit : BaseEntity
{
    /// <summary>
    /// FK to Config.PolicyType - navigation removed for cross-service boundary
    /// </summary>
    public int PolicyTypeId { get; set; }

    /// <summary>
    /// FK to Config.LicenseType - navigation removed for cross-service boundary
    /// </summary>
    public int? LicenseTypeId { get; set; }

    /// <summary>
    /// FK to Config.Company - navigation removed for cross-service boundary
    /// </summary>
    public int? CompanyId { get; set; }

    [MaxLength(50)] public string ChangeType { get; set; } = string.Empty; // CREATE, UPDATE, DELETE

    [MaxLength(500)] public string? OldValue { get; set; }

    [MaxLength(500)] public string? NewValue { get; set; }

    [MaxLength(500)] public string? ChangeReason { get; set; }
}
