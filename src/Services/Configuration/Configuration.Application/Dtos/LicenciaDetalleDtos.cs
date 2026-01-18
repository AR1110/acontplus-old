namespace Configuration.Application.Dtos;

public record LicenciaDetalleItem(
    int Id,
    int AplicacionId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total
);

public record LicenciaDetalleCreate(
    int AplicacionId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total
);
public record LicenciaDetalleUpdate(
    int Id,
    int AplicacionId,
    decimal? Cost,
    decimal? Tax,
    decimal? Discount,
    decimal? Total
);

