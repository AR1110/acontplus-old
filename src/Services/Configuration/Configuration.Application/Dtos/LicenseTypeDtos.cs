namespace Configuration.Application.Dtos;

public record LicenseTypeCreate(
    string Code,
    string Name,
    string Description,
    int? CreatedByUserId = null
);

public record LicenseTypeUpdate(
    string Code,
    string Name,
    string Description,
    int? UpdatedByUserId = null
);

public record LicenseTypeItem(
    int Id,
    string Code,
    string Name,
    string Description,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
