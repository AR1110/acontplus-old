namespace Identity.Application.Dtos;

public record LicenseAccessCreate(
    int LicenciaId,
    int RoleId
);

public record LicenseAccessUpdate(
    int LicenciaId,
    int RoleId
);

public record LicenseAccessItem(
    int Id,
    int LicenciaId,
    string LicenciaName,
    int RoleId,
    string RoleName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
