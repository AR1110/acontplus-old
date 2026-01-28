namespace Configuration.Domain.Entities;

[Table("Ec2Instance", Schema = "Config")]
public class Ec2Instance : BaseEntity
{
    [MaxLength(50)] public required string Region { get; set; }

    [MaxLength(20)] public required string InstanceId { get; set; }

    [MaxLength(100)] public string? InstanceName { get; set; }

    [MaxLength(50)] public string? InstanceType { get; set; }

    [MaxLength(15)] public required string IpAddress { get; set; }

    [MaxLength(300)] public string? UrlStart { get; set; }

    [MaxLength(300)] public string? UrlStop { get; set; }
}
