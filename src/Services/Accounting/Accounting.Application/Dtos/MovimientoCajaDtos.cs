namespace Accounting.Application.Dtos;

public record CreateMovimientoCajaDto(
    int IdTipoDocumento,
    int CustomerId,
    int? IdSubEntidadFinanciera,
    int IdCaja,
    decimal Valor,
    string? Observaciones,
    string CodEstab
);

public record UpdateMovimientoCajaDto(
    int IdTipoDocumento,
    int CustomerId,
    int? IdSubEntidadFinanciera,
    int IdCaja,
    decimal Valor,
    string? Observaciones,
    string CodEstab
);

public record MovimientoCajaDtos(
    CreateMovimientoCajaDto Create,
    UpdateMovimientoCajaDto Update
);
