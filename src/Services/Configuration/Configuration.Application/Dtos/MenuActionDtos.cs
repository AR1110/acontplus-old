namespace Configuration.Application.Dtos;

public record MenuActionCreate(int MenuId, int ActionId, int? CreatedByUserId = null);

public record MenuActionUpdate(int MenuId, int ActionId, int? UpdatedByUserId = null);

public record MenuActionItem(
    int Id,
    int MenuId,
    string MenuName,
    int ActionId,
    string ActionName,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);