namespace Common.Application.Dtos;

public record UserManualCreate(
    int UserManualTypeId,
    int? MenuId,
    string Title,
    string Content,
    bool IsActive = true,
    int? CreatedByUserId = null
);

public record UserManualUpdate(
    int UserManualTypeId,
    int? MenuId,
    string Title,
    string Content,
    bool IsActive = true,
    int? UpdatedByUserId = null
);

public record UserManualItem(
    int Id,
    int UserManualTypeId,
    string UserManualTypeName,
    int? MenuId,
    string? MenuName,
    string Title,
    string Content,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record UserManualCreatedResponse(
    int Id,
    int UserManualTypeId,
    string UserManualTypeName,
    int? MenuId,
    string? MenuName,
    string Title,
    string Content,
    bool IsActive,
    DateTime CreatedAt,
    int? CreatedByUserId
);

public record UserManualUpdatedResponse(
    int Id,
    int UserManualTypeId,
    string UserManualTypeName,
    int? MenuId,
    string? MenuName,
    string Title,
    string Content,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int? CreatedByUserId,
    int? UpdatedByUserId
);
