namespace Identity.Application.Dtos;

public record LicenseAccessCreate(
    int LicenseId,
    int RoleId
);

public record LicenseAccessUpdate(
    int LicenseId,
    int RoleId
);

public record LicenseAccessItem(
    int Id,
    int LicenseId,
    string LicenciaName,
    int RoleId,
    string RoleName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
