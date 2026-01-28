namespace Configuration.Application.Dtos;

public record MenuCreate(
    int ApplicationId,
    string Code,
    string Icon,
    string Name,
    int Order,
    string Url,
    int? ParentId = null,
    int? CreatedByUserId = null
);

public record MenuUpdate(
    int ApplicationId,
    string Code,
    string Icon,
    string Name,
    int Order,
    string Url,
    int? ParentId = null,
    int? UpdatedByUserId = null
);

public record MenuItem(
    int Id,
    int ApplicationId,
    string ApplicationName,
    string Code,
    string Icon,
    string Name,
    int Order,
    string Url,
    int? ParentId,
    string? ParentName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    ICollection<MenuItem> Children
);
