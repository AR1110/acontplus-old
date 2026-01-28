namespace Configuration.Application.Dtos;

public record SystemCreate(
    string Code,
    string Name,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null
);

public record SystemUpdate(
    string Code,
    string Name,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null
);

public record SystemItem(
    int Id,
    string Code,
    string Name,
    string? DomainUrl,
    string IpAddress,
    string? ConnectionStrings,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyList<SystemApplicationItem> Applications
);

public record SystemApplicationItem(
    int Id,
    string Code,
    string Name,
    string? DomainUrl,
    string? IpAddress,
    string? ConnectionStrings,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
