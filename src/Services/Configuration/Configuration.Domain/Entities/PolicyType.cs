namespace Configuration.Domain.Entities;

/// <summary>
///     Defines the types of policies that can be applied to licenses and companies
/// </summary>
[Table("PolicyType", Schema = "Config")]
public class PolicyType : BaseEntity
{
    [MaxLength(50)] public string Code { get; set; } = string.Empty;

    [MaxLength(250)] public string Name { get; set; } = string.Empty;

    [MaxLength(500)] public string? Description { get; set; }

    [MaxLength(50)] public string DataType { get; set; } = string.Empty; // INT, DECIMAL, BOOLEAN, STRING

    [MaxLength(100)] public string? DefaultValue { get; set; }

    public ICollection<LicensePolicyConfiguration> LicensePolicyConfigurations { get; set; } =
        [];

    public ICollection<CompanyPolicyOverride> CompanyPolicyOverrides { get; set; } = [];
}