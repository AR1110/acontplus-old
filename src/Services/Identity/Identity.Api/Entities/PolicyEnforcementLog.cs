namespace Identity.Api.Entities;

/// <summary>
///     Logs all policy enforcement decisions for audit and compliance
/// </summary>
[Table("PolicyEnforcementLog", Schema = "Identity")]
public class PolicyEnforcementLog : BaseEntity
{
    /// <summary>
    /// FK to Config.Company - navigation removed for cross-service boundary
    /// </summary>
    public int CompanyId { get; set; }

    public int? UserId { get; set; } //Remove

    /// <summary>
    /// FK to Config.PolicyType - navigation removed for cross-service boundary
    /// </summary>
    public int PolicyTypeId { get; set; }

    [MaxLength(500)] public string? RequestedValue { get; set; }

    [MaxLength(500)] public string? AllowedValue { get; set; }

    [MaxLength(50)] public string ActionTaken { get; set; } = string.Empty; // ALLOWED, DENIED, LIMITED

    [MaxLength(100)] public string? ResourceType { get; set; } // INVOICE, INVENTORY_ITEM, USER, etc.

    [MaxLength(100)] public string? ResourceId { get; set; }

    public string? AdditionalContext { get; set; } // JSON format for flexible data
}
