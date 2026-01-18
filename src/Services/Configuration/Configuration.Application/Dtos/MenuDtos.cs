namespace Configuration.Application.Dtos;

public record MenuCreate(
    int AplicacionId,
    string Code,
    string Icon,
    string Name,
    int Order,
    string Url,
    int? ParentId = null,
    int? CreatedByUserId = null
);

public record MenuUpdate(
    int AplicacionId,
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
    int AplicacionId,
    string AplicacionName,
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