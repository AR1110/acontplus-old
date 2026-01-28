namespace Configuration.Application.Dtos;

public record Ec2InstanceItem
{
    public int Id { get; init; }
    public string Region { get; init; } = string.Empty;
    public string InstanceId { get; init; } = string.Empty;
    public string? InstanceName { get; init; }
    public string? InstanceType { get; init; }
    public string IpAddress { get; init; } = string.Empty;
    public string? UrlStart { get; init; }
    public string? UrlStop { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; }
}
public record Ec2InstanceCreate
{
    public required string Region { get; init; }
    public required string InstanceId { get; init; }
    public string? InstanceName { get; init; }
    public string? InstanceType { get; init; }
    public required string IpAddress { get; init; }
    public string? UrlStart { get; init; }
    public string? UrlStop { get; init; }
}

public record Ec2InstanceUpdate
{
    public required string Region { get; init; }
    public required string InstanceId { get; init; }
    public string? InstanceName { get; init; }
    public string? InstanceType { get; init; }
    public required string IpAddress { get; init; }
    public string? UrlStart { get; init; }
    public string? UrlStop { get; init; }
}
