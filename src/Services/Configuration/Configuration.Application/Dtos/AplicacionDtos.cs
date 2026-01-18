namespace Configuration.Application.Dtos;

public record AplicacionCreate(
    string Code,
    string Name,
    int SistemaId,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null,
    bool IsActive = true
);

public record AplicacionUpdate(
    string Code,
    string Name,
    int SistemaId,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null,
    bool IsActive = true
);

public record AplicacionItem(
    int Id,
    string Code,
    string Name,
    int SistemaId,
    string SistemaName,
    string? DomainUrl,
    string? IpAddress,
    string? ConnectionStrings,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
