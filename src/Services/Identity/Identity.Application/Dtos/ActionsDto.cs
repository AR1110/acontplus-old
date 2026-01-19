namespace Identity.Application.Dtos;

public record ActionCreate(
    string Code,
    string Name,
    string? Description,
    int? CreatedByUserId = null);

public record ActionUpdate(
    string Code,
    string Name,
    string? Description,
    int? UpdatedByUserId = null);

public record ActionItem(
    int Id,
    string Code,
    string Name,
    string? Description,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);