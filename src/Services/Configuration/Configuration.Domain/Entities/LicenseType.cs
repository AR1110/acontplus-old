namespace Configuration.Domain.Entities;

[Table("LicenseType", Schema = "Config")]
public class LicenseType : BaseEntity
{
    [MaxLength(10)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }

    [MaxLength(500)] public required string Description { get; set; }

    public ICollection<LicensePolicyConfiguration> LicensePolicyConfigurations { get; set; } =
        [];
}