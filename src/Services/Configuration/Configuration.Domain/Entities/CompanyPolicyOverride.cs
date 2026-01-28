namespace Configuration.Domain.Entities;

/// <summary>
///     Allows company-specific policy overrides
/// </summary>
[Table("CompanyPolicyOverride", Schema = "Config")]
public class CompanyPolicyOverride : BaseEntity
{
    public int CompanyId { get; set; }
    public required Company Company { get; set; }

    /// <summary>
    /// FK to Identity.PolicyType - navigation removed for cross-service boundary
    /// </summary>
    public int PolicyTypeId { get; set; }

    [MaxLength(500)] public string PolicyValue { get; set; } = string.Empty;

    [MaxLength(500)] public string? OverrideReason { get; set; }

    public DateTime? ExpiresAt { get; set; }
}
