namespace Configuration.Application.Dtos;

public record SistemaCreate(
    string Code,
    string Name,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null
);

public record SistemaUpdate(
    string Code,
    string Name,
    string? DomainUrl = null,
    string? IpAddress = null,
    string? ConnectionStrings = null
);

public record SistemaItem(
    int Id,
    string Code,
    string Name,
    string? DomainUrl,
    string IpAddress,
    string? ConnectionStrings,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyList<SistemaAplicacionItem> Aplicaciones
);

public record SistemaAplicacionItem(
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
