namespace Configuration.Application.Dtos;

public record LicenseItem(
    int Id,
    string Code,
    int LicenseTypeId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total,
    IReadOnlyList<LicenseDetailItem> Details,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    int? CreatedByUserId,
    int? UpdatedByUserId
);

public record LicenseCreate(
    string Code,
    int LicenseTypeId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total,
    IReadOnlyList<LicenseDetailCreate> Details
);

public record LicenseUpdate(
    string Code,
    int LicenseTypeId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total,
    IReadOnlyList<LicenseDetailUpdate> Details
);
