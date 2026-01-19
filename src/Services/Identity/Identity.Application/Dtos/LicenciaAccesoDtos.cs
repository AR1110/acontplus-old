namespace Identity.Application.Dtos;

public record LicenciaAccesoCreate(
    int LicenseId,
    int RoleId
);

public record LicenciaAccesoUpdate(
    int LicenseId,
    int RoleId
);

public record LicenciaAccesoItem(
    int Id,
    int LicenseId,
    string LicenciaName,
    int RoleId,
    string RoleName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
