namespace Restaurant.Application.Dtos;

public record LookupItem(
    int? Id,
    string? Code,
    string? Value,
    int? DisplayOrder,
    int? ParentId,
    bool? IsDefault,
    string? Metadata
);
