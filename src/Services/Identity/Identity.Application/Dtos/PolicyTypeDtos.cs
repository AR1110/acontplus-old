namespace Identity.Application.Dtos;

public record PolicyTypeCreate(
    string Code,
    string Name,
    string? Description,
    string DataType,
    string? DefaultValue,
    int? CreatedByUserId = null
);

public record PolicyTypeUpdate(
    string Code,
    string Name,
    string? Description,
    string DataType,
    string? DefaultValue,
    int? UpdatedByUserId = null
);

public record PolicyTypeItem(
    int Id,
    string Code,
    string Name,
    string? Description,
    string DataType,
    string? DefaultValue,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
