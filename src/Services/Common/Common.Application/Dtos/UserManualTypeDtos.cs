namespace Common.Application.Dtos;

public record UserManualTypeCreate(string Code, string Name, int? CreatedByUserId = null);

public record UserManualTypeUpdate(string Code, string Name, int? UpdatedByUserId = null);

public record UserManualTypeItem(
    int Id,
    string Code,
    string Name,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    bool IsActive
);