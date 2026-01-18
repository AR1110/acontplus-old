namespace Configuration.Application.Dtos;

public record LicenciaItem(
    int Id,
    string Code,
    int LicenseTypeId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total,
    IReadOnlyList<LicenciaDetalleItem> Detalles,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    int? CreatedByUserId,
    int? UpdatedByUserId
);

public record LicenciaCreate(
    string Code,
    int LicenseTypeId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total,
    IReadOnlyList<LicenciaDetalleCreate> Detalles
);

public record LicenciaUpdate(
    string Code,
    int LicenseTypeId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total,
    IReadOnlyList<LicenciaDetalleUpdate> Detalles
);

