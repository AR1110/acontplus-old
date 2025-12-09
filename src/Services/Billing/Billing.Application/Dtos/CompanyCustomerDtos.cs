namespace Billing.Application.Dtos;

public static class CompanyCustomerDtos
{
    public readonly record struct CreateCompanyCustomerDto(
        int? IdEmpleado,
        int IdTypeId,
        int? IdTipoClienteProveedor,
        int? IdTipoEntidad,
        int? IdCiudad,
        int? IdSubContribuyente,
        int? IdTiempoCredito,
        int? IdEmpresa,
        int? IdCargo,
        int? FormaPagoSriId,
        string IdCard,
        string BusinessName,
        string TradeName,
        string Direccion,
        string Telefono,
        string Correo,
        string Placa,
        decimal? MontoCredito,
        string Nota,
        bool SriValidation,
        string InfoCrediticia,
        bool? ConfigValorBruto
    );

    public readonly record struct UpdateCompanyCustomerDto(
        int Id,
        int? IdEmpleado,
        int IdTipoIdentificacion,
        int? IdTipoClienteProveedor,
        int? IdTipoEntidad,
        int? IdCiudad,
        int? IdSubContribuyente,
        int? IdTiempoCredito,
        int? IdEmpresa,
        int? IdCargo,
        int? IdFormaPagoSri,
        string NumeroIdentificacion,
        string NombreFiscal,
        string NombreComercial,
        string Direccion,
        string Telefono,
        string Correo,
        string Placa,
        decimal? MontoCredito,
        string Nota,
        bool ValidationSri,
        bool Estado,
        string InfoCrediticia,
        bool? ConfigValorBruto
    );
}


