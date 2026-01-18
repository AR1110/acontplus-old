namespace Configuration.Application.Dtos;

public record ApplicationCreate(
    string Code,
    string Name,
    int SystemId,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null,
    bool IsActive = true
);

public record ApplicationUpdate(
    string Code,
    string Name,
    int SystemId,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null,
    bool IsActive = true
);

public record ApplicationItem(
    int Id,
    string Code,
    string Name,
    int SystemId,
    string SystemName,
    string? DomainUrl,
    string? IpAddress,
    string? ConnectionStrings,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
