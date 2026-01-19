namespace Identity.Api.Entities;

/// <summary>
///     Defines the types of policies that can be applied to licenses and companies.
/// </summary>
[Table("PolicyType", Schema = "Compliance")]
public class PolicyType : BaseEntity
{
    [MaxLength(50)] public string Code { get; set; } = string.Empty;

    [MaxLength(250)] public string Name { get; set; } = string.Empty;

    [MaxLength(500)] public string? Description { get; set; }

    [MaxLength(50)] public string DataType { get; set; } = string.Empty; // INT, DECIMAL, BOOLEAN, STRING

    [MaxLength(100)] public string? DefaultValue { get; set; }

    // Note: LicensePolicyConfigurations and CompanyPolicyOverrides are in Configuration service
    // Query via PolicyTypeId - navigation removed for cross-service boundary
}
