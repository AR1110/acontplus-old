namespace Configuration.Application.Dtos;

public record LicenseDetailItem(
    int Id,
    int ApplicationId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total
);

public record LicenseDetailCreate(
    int ApplicationId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total
);

public record LicenseDetailUpdate(
    int Id,
    int ApplicationId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total
);
