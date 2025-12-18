namespace Purchases.Application.Dtos.Suppliers;

public record SupplierCreate(
    int IdTipoIdentificacion,
    string NumeroIdentificacion,
    string NombreFiscal,
    string NombreComercial,
    int? IdCiudad,
    int? IdTipoClienteProveedor,
    int? IdTipoEntidad,
    int? IdSubContribuyente,
    int? IdTiempoCredito,
    string? Direccion,
    string? Telefono,
    string? Correo,
    int CreatedByUserId);

public record SupplierUpdate(
    int Id,
    int IdTipoIdentificacion,
    string NumeroIdentificacion,
    string NombreFiscal,
    string NombreComercial,
    int? IdCiudad,
    int? IdTipoClienteProveedor,
    int? IdTipoEntidad,
    int? IdSubContribuyente,
    int? IdTiempoCredito,
    string? Direccion,
    string? Telefono,
    string? Correo,
    bool IsActive);

public record SupplierItem(
    int Id,
    int IdTipoIdentificacion,
    string NumeroIdentificacion,
    string NombreFiscal,
    string NombreComercial,
    int? IdCiudad,
    int? IdTipoClienteProveedor,
    int? IdTipoEntidad,
    int? IdSubContribuyente,
    int? IdTiempoCredito,
    string? Direccion,
    string? Telefono,
    string? Correo,
    bool IsActive);
