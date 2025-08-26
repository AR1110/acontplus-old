namespace Application.DTOs;

public record CreateEstablishmentDto(
    string Canton,
    string Actividad,
    string AgenteRetencion,
    string Contribuyente,
    string Estab,
    string ContribuyenteEspecial,
    string ObligadoContabilidad,
    string NombreComercial,
    string DirEstablecimiento,
    string Telefono,
    string ContribuyenteRimpe,
    string Correo,
    int? DemoStepId,
    string? PtosEmi,
    string? Bodegas
);

public record UpdateEstablishmentDto(
    string Canton,
    string Actividad,
    string AgenteRetencion,
    string Contribuyente,
    string ContribuyenteEspecial,
    string ObligadoContabilidad,
    string NombreComercial,
    string DirEstablecimiento,
    string Telefono,
    string ContribuyenteRimpe,
    string Correo
);

public record EstablishmentDto(
    CreateEstablishmentDto Create,
    UpdateEstablishmentDto Update
);
