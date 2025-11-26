namespace Accounting.Application.Dtos;

public record CreateSubEntidadFinancieraDto(
    int IdEntidadFinanciera,
    string Descripcion,
    string Codigo,
    bool ControlCaja,
    decimal Interes
);

public record UpdateSubEntidadFinancieraDto(
    int IdEntidadFinanciera,
    string Descripcion,
    string Codigo,
    bool ControlCaja,
    decimal Interes,
    bool Estado
);

public record SubEntidadFinancieraDto(
    CreateSubEntidadFinancieraDto Create,
    UpdateSubEntidadFinancieraDto Update
);
