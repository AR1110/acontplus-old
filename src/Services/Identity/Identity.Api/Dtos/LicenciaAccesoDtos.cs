namespace Identity.Api.Dtos;

public record LicenciaAccesoCreate(
    int LicenciaId,
    int RoleId
);

public record LicenciaAccesoUpdate(
    int LicenciaId,
    int RoleId
);

public record LicenciaAccesoItem(
    int Id,
    int LicenciaId,
    string LicenciaName,
    int RoleId,
    string RoleName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);