namespace Identity.Api.Entities;

/// <summary>
///     Logs all policy enforcement decisions for audit and compliance
/// </summary>
[Table("PolicyEnforcementLog", Schema = "Audit")]
public class PolicyEnforcementLog : BaseEntity
{
    public int CompanyId { get; set; }
    public required Company Company { get; set; }
    public int? UserId { get; set; } //Remove
    public int PolicyTypeId { get; set; }
    public required PolicyType PolicyType { get; set; } = null!;

    [MaxLength(500)] public string? RequestedValue { get; set; }

    [MaxLength(500)] public string? AllowedValue { get; set; }

    [MaxLength(50)] public string ActionTaken { get; set; } = string.Empty; // ALLOWED, DENIED, LIMITED

    [MaxLength(100)] public string? ResourceType { get; set; } // INVOICE, INVENTORY_ITEM, USER, etc.

    [MaxLength(100)] public string? ResourceId { get; set; }

    public string? AdditionalContext { get; set; } // JSON format for flexible data
}