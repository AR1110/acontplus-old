namespace Identity.Api.Dtos;

public record RoleCreate(
    string Code,
    string Name,
    string? Description
);

public record RoleUpdate(
    string Code,
    string Name,
    string? Description
);

public record RoleItem(
    int Id,
    string Code,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record RoleCreatedResponse(
    int Id,
    string Code,
    string Name
);
