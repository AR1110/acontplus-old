namespace Common.Application.Dtos;

public record TagCreate(
    string Name
);

public record TagUpdate(
    string Name
);

public record TagItem(
    int Id,
    string Name,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);